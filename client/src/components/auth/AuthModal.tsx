'use client'
import React, { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
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
    className="fixed inset-0 z-[100] bg-neutral-900/40 backdrop-blur-sm transition-opacity"
    onClick={onClose}
    aria-hidden="true"
  />
)

const Panel: React.FC<React.PropsWithChildren<{ title: string; onClose: () => void }>> = ({ title, onClose, children }) => (
  <div
    role="dialog"
    aria-modal
    aria-labelledby="auth-modal-title"
    className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6"
  >
    <div className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors z-10"
      >
        <X className="size-4" />
      </button>
      
      <div className="px-6 sm:px-8 pt-10 pb-6 text-center">
        <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Chào mừng đến với LắcKey
        </p>
      </div>
      
      <div className="px-6 sm:px-8 pb-10">
        {children}
      </div>
    </div>
  </div>
)

const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string; className?: string }>> = ({ htmlFor, className, children }) => (
  <label htmlFor={htmlFor} className={`flex items-center gap-2 text-sm font-medium text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className ?? ''}`}>
    {children}
  </label>
)

const SignInForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const close = useAuthModalStore((s) => s.close)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
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
        <Label htmlFor="signin-email"><Mail className="w-4 h-4 text-neutral-400" /> Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password"><Lock className="w-4 h-4 text-neutral-400" /> Mật khẩu</Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 pr-12 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword((v) => !v)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-4">
        <Button 
          type="submit" 
          className="w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-medium transition-all flex items-center justify-center gap-2" 
          disabled={isPending}
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
          ) : (
            <>Đăng nhập <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
        <div className="text-center">
          <button 
            type="button" 
            onClick={onSwitch} 
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors" 
            disabled={isPending}
          >
            Chưa có tài khoản? <span className="font-semibold text-[var(--brand-accent)]">Đăng ký ngay</span>
          </button>
        </div>
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
        <Label htmlFor="signup-name"><User className="w-4 h-4 text-neutral-400" /> Họ và tên</Label>
        <Input id="signup-name" type="text" placeholder="Nguyễn Văn A" required className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email"><Mail className="w-4 h-4 text-neutral-400" /> Email</Label>
        <Input id="signup-email" type="email" placeholder="you@example.com" required className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password"><Lock className="w-4 h-4 text-neutral-400" /> Mật khẩu</Label>
        <div className="relative">
          <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" required className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 pr-12 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mt-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Mật khẩu tối thiểu 8 ký tự
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm"><ShieldCheck className="w-4 h-4 text-neutral-400" /> Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input id="signup-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" required className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 pr-12 focus:bg-white focus:ring-2 focus:ring-[var(--brand-accent)] focus:border-transparent transition-all" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isPending} />
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="p-3 bg-neutral-50 rounded-xl mt-2">
        <p className="text-xs text-neutral-500 leading-relaxed text-center">
          Bằng cách tạo tài khoản, bạn chấp nhận <a className="text-neutral-900 font-medium hover:underline" href="#" target="_blank" rel="noreferrer">Điều khoản</a> và <a className="text-neutral-900 font-medium hover:underline" href="#" target="_blank" rel="noreferrer">Chính sách</a> của LắcKey.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 pt-4">
        <Button 
          type="submit" 
          className="w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-medium transition-all flex items-center justify-center gap-2" 
          disabled={isPending}
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Đang tạo...</>
          ) : (
            <>Tạo tài khoản <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
        <div className="text-center">
          <button 
            type="button" 
            onClick={onSwitch} 
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors" 
            disabled={isPending}
          >
            Đã có tài khoản? <span className="font-semibold text-[var(--brand-accent)]">Đăng nhập ngay</span>
          </button>
        </div>
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
