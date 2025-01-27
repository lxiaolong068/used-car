export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const handleErrors = (error: unknown) => {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    )
  }
  // 其他错误处理...
} 