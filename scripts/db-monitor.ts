import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

interface TableStats {
  tableName: string;
  rowCount: number;
  dataSize: number;
  indexSize: number;
}

interface DatabaseMetrics {
  tableStats: TableStats[];
  cacheMetrics: {
    queryCache: {
      size: number;
      hitRate: number;
    };
    bufferPool: {
      size: number;
      hitRate: number;
    };
  };
  timestamp: Date;
}

interface StatusRow {
  Variable_name: string;
  Value: string;
}

async function collectTableStats(): Promise<TableStats[]> {
  const result = await prisma.$queryRaw<TableStats[]>`
    SELECT 
      TABLE_NAME as tableName,
      TABLE_ROWS as rowCount,
      DATA_LENGTH as dataSize,
      INDEX_LENGTH as indexSize
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = DATABASE()
  `;
  
  // 转换 BigInt 为数字
  return result.map(row => ({
    ...row,
    rowCount: Number(row.rowCount),
    dataSize: Number(row.dataSize),
    indexSize: Number(row.indexSize)
  }));
}

async function collectCacheMetrics() {
  try {
    const queryCacheResult = await prisma.$queryRaw<StatusRow[]>`
      SHOW GLOBAL STATUS 
      WHERE Variable_name IN ('Qcache_hits', 'Qcache_inserts')
    `;

    const bufferPoolResult = await prisma.$queryRaw<StatusRow[]>`
      SHOW GLOBAL STATUS 
      WHERE Variable_name IN ('Innodb_buffer_pool_reads', 'Innodb_buffer_pool_read_requests')
    `;

    const qcacheHits = Number(queryCacheResult[0]?.Value || 0);
    const qcacheInserts = Number(queryCacheResult[1]?.Value || 0);
    const bpReads = Number(bufferPoolResult[0]?.Value || 0);
    const bpRequests = Number(bufferPoolResult[1]?.Value || 0);

    return {
      queryCache: {
        size: qcacheHits,
        hitRate: qcacheHits / (qcacheHits + qcacheInserts) * 100 || 0
      },
      bufferPool: {
        size: bpReads,
        hitRate: bpReads / (bpReads + bpRequests) * 100 || 0
      }
    };
  } catch (error) {
    console.warn('获取缓存指标失败，返回默认值:', error);
    return {
      queryCache: { size: 0, hitRate: 0 },
      bufferPool: { size: 0, hitRate: 0 }
    };
  }
}

async function collectMetrics(): Promise<DatabaseMetrics> {
  const [tableStats, cacheMetrics] = await Promise.all([
    collectTableStats(),
    collectCacheMetrics()
  ]);

  return {
    tableStats,
    cacheMetrics,
    timestamp: new Date()
  };
}

async function saveMetrics(metrics: DatabaseMetrics) {
  const metricsDir = join(process.cwd(), 'metrics');
  await mkdir(metricsDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = join(metricsDir, `metrics-${timestamp}.json`);

  await writeFile(filename, JSON.stringify(metrics, null, 2));
  console.log(`指标已保存到: ${filename}`);
}

async function checkThresholds(metrics: DatabaseMetrics) {
  const alerts = [];

  // 检查表大小
  for (const table of metrics.tableStats) {
    if (table.dataSize > 1000000000) { // 1GB
      alerts.push(`警告: 表 ${table.tableName} 大小超过 1GB`);
    }
  }

  // 检查缓存命中率
  if (metrics.cacheMetrics.queryCache.hitRate < 80) {
    alerts.push(`警告: 查询缓存命中率低于 80%`);
  }
  if (metrics.cacheMetrics.bufferPool.hitRate < 90) {
    alerts.push(`警告: 缓冲池命中率低于 90%`);
  }

  return alerts;
}

async function monitorDatabase() {
  try {
    console.log('开始收集数据库指标...');
    const metrics = await collectMetrics();
    await saveMetrics(metrics);

    const alerts = await checkThresholds(metrics);
    if (alerts.length > 0) {
      console.log('发现以下问题:');
      alerts.forEach(alert => console.log(alert));
    } else {
      console.log('数据库运行正常，未发现异常');
    }

    return {
      success: true,
      alerts,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('监控失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const analyzeOnly = process.argv.includes('--analyze-only');
  
  monitorDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('监控失败:', error);
      process.exit(1);
    });
}

export { monitorDatabase }; 