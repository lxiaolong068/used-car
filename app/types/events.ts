import { ReactNode } from 'react';

// 通用事件处理器类型
export type EventHandler<T = any> = (event: T) => void;

// 键盘事件处理器类型
export interface KeyboardEventHandler {
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
}

// 鼠标事件处理器类型
export interface MouseEventHandler {
  onClick?: (event: MouseEvent) => void;
  onDoubleClick?: (event: MouseEvent) => void;
  onContextMenu?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
}

// 触摸事件处理器类型
export interface TouchEventHandler {
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
}

// 焦点事件处理器类型
export interface FocusEventHandler {
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

// 表单事件处理器类型
export interface FormEventHandler {
  onChange?: (event: Event) => void;
  onInput?: (event: Event) => void;
  onSubmit?: (event: Event) => void;
  onReset?: (event: Event) => void;
}

// 拖拽事件处理器类型
export interface DragEventHandler {
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
}

// 滚动事件处理器类型
export interface ScrollEventHandler {
  onScroll?: (event: Event) => void;
  onScrollEnd?: () => void;
  onScrollStart?: () => void;
}

// 动画事件处理器类型
export interface AnimationEventHandler {
  onAnimationStart?: (event: AnimationEvent) => void;
  onAnimationEnd?: (event: AnimationEvent) => void;
  onAnimationIteration?: (event: AnimationEvent) => void;
}

// 过渡事件处理器类型
export interface TransitionEventHandler {
  onTransitionStart?: (event: TransitionEvent) => void;
  onTransitionEnd?: (event: TransitionEvent) => void;
  onTransitionCancel?: (event: TransitionEvent) => void;
  onTransitionRun?: (event: TransitionEvent) => void;
}

// 组合事件处理器类型
export type CompositeEventHandler = 
  & KeyboardEventHandler 
  & MouseEventHandler 
  & TouchEventHandler 
  & FocusEventHandler 
  & FormEventHandler 
  & DragEventHandler 
  & ScrollEventHandler 
  & AnimationEventHandler 
  & TransitionEventHandler;

// 自定义事件类型
export interface CustomEvent<T = any> {
  type: string;
  detail?: T;
  timestamp: number;
  target?: EventTarget;
}

// 自定义事件处理器类型
export type CustomEventHandler<T = any> = (event: CustomEvent<T>) => void;

// 事件订阅器类型
export interface EventSubscription {
  unsubscribe: () => void;
}

// 事件发布器类型
export interface EventEmitter<T = any> {
  on(event: string, handler: CustomEventHandler<T>): EventSubscription;
  off(event: string, handler: CustomEventHandler<T>): void;
  emit(event: string, detail?: T): void;
  once(event: string, handler: CustomEventHandler<T>): EventSubscription;
}

// 手势事件类型
export interface GestureEvent {
  type: 'tap' | 'swipe' | 'pinch' | 'rotate' | 'pan';
  center: { x: number; y: number };
  deltaX?: number;
  deltaY?: number;
  scale?: number;
  rotation?: number;
  velocity?: { x: number; y: number };
  direction?: 'left' | 'right' | 'up' | 'down';
  target?: EventTarget;
}

// 手势事件处理器类型
export interface GestureEventHandler {
  onTap?: (event: GestureEvent) => void;
  onSwipe?: (event: GestureEvent) => void;
  onPinch?: (event: GestureEvent) => void;
  onRotate?: (event: GestureEvent) => void;
  onPan?: (event: GestureEvent) => void;
}

// 虚拟滚动事件类型
export interface VirtualScrollEvent {
  startIndex: number;
  endIndex: number;
  visibleStartIndex: number;
  visibleEndIndex: number;
  scrollTop: number;
  scrollDirection: 'forward' | 'backward';
}

// 虚拟滚动事件处理器类型
export interface VirtualScrollEventHandler {
  onScroll?: (event: VirtualScrollEvent) => void;
  onItemsRendered?: (event: VirtualScrollEvent) => void;
} 