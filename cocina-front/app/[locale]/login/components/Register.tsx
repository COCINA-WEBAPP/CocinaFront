"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { register } from "@/lib/services/user";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const t = useTranslations("Register");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("passwordLength"));
      setIsLoading(false);
      return;
    }

    try {
      const user = await register({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
      });

      console.log("Usuario registrado:", user);
      setSuccess(true);

      setFormData({ username: "", email: "", fullName: "", password: "", confirmPassword: "" });

      setTimeout(() => { onSuccess?.(); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("registerError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 disabled:opacity-50 transition bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{t("successMessage")}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{t("fullName")}</label>
        <input
          id="fullName" name="fullName" type="text"
          placeholder={t("fullNamePlaceholder")}
          value={formData.fullName} onChange={handleChange}
          required disabled={isLoading} className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{t("username")}</label>
        <input
          id="username" name="username" type="text"
          placeholder={t("usernamePlaceholder")}
          value={formData.username} onChange={handleChange}
          required disabled={isLoading} className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{t("email")}</label>
        <input
          id="register-email" name="email" type="email"
          placeholder={t("emailPlaceholder")}
          value={formData.email} onChange={handleChange}
          required disabled={isLoading} className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{t("password")}</label>
        <input
          id="register-password" name="password" type="password"
          placeholder="••••••••"
          value={formData.password} onChange={handleChange}
          required disabled={isLoading} minLength={6} className={inputCls}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{t("confirmPassword")}</label>
        <input
          id="confirmPassword" name="confirmPassword" type="password"
          placeholder="••••••••"
          value={formData.confirmPassword} onChange={handleChange}
          required disabled={isLoading} className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || success}
        aria-busy={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#f97316] to-[#fb923c] text-white font-semibold text-sm shadow hover:opacity-90 transition disabled:opacity-50"
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" />{t("creatingAccount")}</>
        ) : (
          <><UserPlus size={16} />{t("createAccount")}</>
        )}
      </button>

      <div className="sr-only" aria-live="polite" role="status">
        {success && t("successMessage")}
        {error && error}
      </div>

      <p className="text-xs text-gray-400 text-center">{t("termsNotice")}</p>
    </form>
  );
}