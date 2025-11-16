'use client'
import React, { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthModalStore } from '@/store/authModal'
import { useLogin } from '@/hook/useAuth'
import { useSignup } from '@/hook/useAuth'
import { toast } from 'sonner'
import { showSuccessToast } from '@/components/toast/AppToast'

function normalizeErrorMessage(err: unknown, fallback: string): string {
  const m = err instanceof Error ? String(err.message || '') : ''
  const s = m.trim()
  if (!s) return fallback
  const looksHtml = /^<!DOCTYPE/i.test(s) || /^<html/i.test(s) || /<[^>]+>/.test(s)
  if (looksHtml) return fallback
  if (s.length > 300) return fallback
  return s
}

const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

const Overlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
    onClick={onClose}
    aria-hidden="true"
  />
)

const Panel: React.FC<React.PropsWithChildren<{ title: string; onClose: () => void }>> = ({ title, onClose, children }) => (
  <div
    role="dialog"
    aria-modal
    aria-labelledby="auth-modal-title"
    className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4"
  >
    <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_#B5CCBC]">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-8 w-8 items-center justify-center bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors z-10"
      >
        <X className="size-4" />
      </button>
      
      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-4 border-b-4 border-black">
        <h2 id="auth-modal-title" className="font-[family-name:var(--font-retro)] text-2xl sm:text-3xl font-bold tracking-wider uppercase pr-10">
          {title}
        </h2>
        <p className="mt-2 text-sm text-neutral-700 font-medium">Chào mừng đến với LắcKey ✨</p>
      </div>
      
      <div className="px-5 sm:px-8 py-6 sm:py-8">
        {children}
      </div>
    </div>
  </div>
)

const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string; className?: string }>> = ({ htmlFor, className, children }) => (
  <label htmlFor={htmlFor} className={`text-xs font-bold uppercase tracking-wide text-neutral-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className ?? ''}`}>{children}</label>
)


const SignInForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const close = useAuthModalStore((s) => s.close)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const { mutateAsync, isPending } = useLogin()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await mutateAsync({ email, password })
      showSuccessToast({ title: 'Đăng nhập thành công', message: 'Chào mừng bạn quay lại LắcKey!' })
      close()
    } catch (err) {
      const msg = normalizeErrorMessage(err, 'Đăng nhập thất bại')
      setError(msg)
      toast.error(msg)
    }
  }, [mutateAsync, email, password, close])

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-2">
        <Label htmlFor="signin-email">📧 Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">🔒 Mật khẩu</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="••••••••"
          required
          className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-50 border-2 border-red-500 text-sm text-red-700 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-3">
        <Button 
          type="submit" 
          className="w-full h-11 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-bold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-none" 
          disabled={isPending}
        >
          {isPending ? '⏳ Đang xử lý...' : '→ Đăng nhập'}
        </Button>
        <button 
          type="button" 
          onClick={onSwitch} 
          className="text-sm text-neutral-700 hover:text-black font-medium underline-offset-2 hover:underline transition-colors" 
          disabled={isPending}
        >
          Chưa có tài khoản? <span className="font-bold">Đăng ký ngay</span>
        </button>
      </div>
    </form>
  )
}

const SignUpForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const close = useAuthModalStore((s) => s.close)
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { mutateAsync, isPending } = useSignup()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      const msg = 'Mật khẩu phải có ít nhất 8 ký tự'
      setError(msg)
      toast.error(msg)
      return
    }
    if (password !== confirmPassword) {
      const msg = 'Xác nhận mật khẩu không khớp'
      setError(msg)
      toast.error(msg)
      return
    }
    try {
      await mutateAsync({ username, email, password })
      showSuccessToast({ title: 'Tạo tài khoản thành công', message: 'Chào mừng bạn đến với LắcKey!' })
      close()
    } catch (err) {
      const msg = normalizeErrorMessage(err, 'Tạo tài khoản thất bại')
      setError(msg)
      toast.error(msg)
    }
  }, [mutateAsync, username, email, password, confirmPassword, close])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">👤 Họ và tên</Label>
        <Input id="signup-name" type="text" placeholder="Nguyễn Văn A" required className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">📧 Email</Label>
        <Input id="signup-email" type="email" placeholder="you@example.com" required className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signup-password">🔒 Mật khẩu</Label>
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[10px] px-2 py-1 bg-neutral-100 border border-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
            {showPassword ? (<span className="inline-flex items-center gap-1"><EyeOff className="h-3 w-3"/>Ẩn</span>) : (<span className="inline-flex items-center gap-1"><Eye className="h-3 w-3"/>Hiện</span>)}
          </button>
        </div>
        <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" required className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} />
        <p className="text-[10px] text-neutral-600 font-medium">✓ Mật khẩu tối thiểu 8 ký tự</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signup-confirm">🔐 Xác nhận</Label>
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-[10px] px-2 py-1 bg-neutral-100 border border-black font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors">
            {showConfirm ? (<span className="inline-flex items-center gap-1"><EyeOff className="h-3 w-3"/>Ẩn</span>) : (<span className="inline-flex items-center gap-1"><Eye className="h-3 w-3"/>Hiện</span>)}
          </button>
        </div>
        <Input id="signup-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" required className="h-11 border-2 border-black focus:border-black focus:ring-2 focus:ring-[var(--brand-secondary)] rounded-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isPending} />
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-50 border-2 border-red-500 text-sm text-red-700 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="px-3 py-2 bg-neutral-50 border-2 border-neutral-300">
        <p className="text-[10px] text-neutral-700 leading-relaxed font-medium">
          Bằng cách tạo tài khoản, bạn chấp nhận <a className="underline hover:text-black font-bold" href="#" target="_blank" rel="noreferrer">Điều khoản</a> và <a className="underline hover:text-black font-bold" href="#" target="_blank" rel="noreferrer">Chính sách</a> của LắcKey.
        </p>
      </div>
      
      <div className="flex flex-col gap-3 pt-2">
        <Button 
          type="submit" 
          className="w-full h-11 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-bold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1 rounded-none" 
          disabled={isPending}
        >
          {isPending ? '⏳ Đang tạo...' : '→ Tạo tài khoản'}
        </Button>
        <button 
          type="button" 
          onClick={onSwitch} 
          className="text-sm text-neutral-700 hover:text-black font-medium underline-offset-2 hover:underline transition-colors" 
          disabled={isPending}
        >
          Đã có tài khoản? <span className="font-bold">Đăng nhập ngay</span>
        </button>
      </div>
    </form>
  )
}

const AuthModal: React.FC = () => {
  const mounted = useIsMounted()
  const open = useAuthModalStore((s) => s.open)
  const view = useAuthModalStore((s) => s.view)
  const close = useAuthModalStore((s) => s.close)
  const setView = useAuthModalStore((s) => s.setView)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!mounted || !open) return null

  return createPortal(
    <>
      <Overlay onClose={close} />
      <Panel title={view === 'signin' ? 'Đăng nhập' : 'Đăng ký'} onClose={close}>
        {view === 'signin' ? (
          <SignInForm onSwitch={() => setView('signup')} />
        ) : (
          <SignUpForm onSwitch={() => setView('signin')} />)
        }
      </Panel>
    </>,
    document.body
  )
}

export default AuthModal
