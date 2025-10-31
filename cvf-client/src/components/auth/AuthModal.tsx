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

const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

const Overlay: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
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
    <div className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-black bg-white shadow-xl">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute right-2 top-2 sm:right-3 sm:top-3 inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 z-10"
      >
        <X className="size-4 sm:size-4" />
      </button>
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <h2 id="auth-modal-title" className="text-lg sm:text-xl font-bold tracking-tight pr-8">{title}</h2>
        <p className="mt-1 text-xs sm:text-sm text-neutral-600 line-clamp-2">Chào mừng đến với LắcKey. Cửa hàng móc khóa và phụ kiện thiết kế theo ý tưởng của bạn.</p>
      </div>
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {children}
      </div>
    </div>
  </div>
)

const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string; className?: string }>> = ({ htmlFor, className, children }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className ?? ''}`}>{children}</label>
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
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại'
      setError(msg)
      toast.error(msg)
    }
  }, [mutateAsync, email, password, close])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-10 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Mật khẩu</Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="••••••••"
          required
          className="h-10 rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onSwitch} className="text-sm text-neutral-600 hover:text-black underline-offset-2 hover:underline" disabled={isPending}>
          Chưa có tài khoản? Đăng ký
        </button>
        <Button type="submit" variant='outline' className="rounded-full px-5 h-10" disabled={isPending}>
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
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
      const msg = err instanceof Error ? err.message : 'Tạo tài khoản thất bại'
      setError(msg)
      toast.error(msg)
    }
  }, [mutateAsync, username, email, password, confirmPassword, close])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google signup removed */}

      <div className="space-y-2">
        <Label htmlFor="signup-name">Họ và tên</Label>
        <Input id="signup-name" type="text" placeholder="Nguyễn Văn A" required className="h-10 rounded-xl" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" placeholder="you@example.com" required className="h-10 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isPending} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signup-password">Mật khẩu</Label>
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-xs text-neutral-600 hover:text-black">
            {showPassword ? (<span className="inline-flex items-center gap-1"><EyeOff className="h-3.5 w-3.5"/>Ẩn</span>) : (<span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5"/>Hiện</span>)}
          </button>
        </div>
        <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 8 ký tự" required className="h-10 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isPending} />
        <p className="text-xs text-neutral-500">Mật khẩu tối thiểu 8 ký tự.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signup-confirm">Xác nhận mật khẩu</Label>
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-xs text-neutral-600 hover:text-black">
            {showConfirm ? (<span className="inline-flex items-center gap-1"><EyeOff className="h-3.5 w-3.5"/>Ẩn</span>) : (<span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5"/>Hiện</span>)}
          </button>
        </div>
        <Input id="signup-confirm" type={showConfirm ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" required className="h-10 rounded-xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isPending} />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-[11px] text-neutral-500 leading-relaxed">
        Bằng cách nhấn Tạo tài khoản, bạn xác nhận đã đọc, hiểu và chấp nhận <a className="underline hover:text-black" href="#" target="_blank" rel="noreferrer">Điều khoản sử dụng</a> và <a className="underline hover:text-black" href="#" target="_blank" rel="noreferrer">Chính sách quyền riêng tư</a> của LắcKey.
      </p>
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onSwitch} className="text-sm text-neutral-600 hover:text-black underline-offset-2 hover:underline" disabled={isPending}>
          Đã có tài khoản? Đăng nhập
        </button>
        <Button type="submit" className="rounded-full px-5 h-10" disabled={isPending}>{isPending ? 'Đang tạo...' : 'Tạo tài khoản'}</Button>
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
