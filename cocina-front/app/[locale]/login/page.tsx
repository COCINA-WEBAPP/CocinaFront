"use client";

import { Suspense, useEffect, useState } from "react";
import { LoginForm } from "./components/Login";
import { RegisterForm } from "./components/Register";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function LoginPageContent() {
  const t = useTranslations("Login");
  const tReg = useTranslations("Register");
  const [activeTab, setActiveTab] = useState("login");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register" || tab === "login") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

        <div className="bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#fdba74] px-7 pt-6 pb-5">
          <h1 className="text-2xl font-bold text-white">
            {activeTab === "login" ? t("loginTab") : tReg("createAccount")}
          </h1>
        </div>

        <div className="flex border-b border-gray-100 bg-white px-7 pt-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-[#f97316] text-[#f97316]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t("loginTab")}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-[#f97316] text-[#f97316]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t("registerTab")}
          </button>
        </div>

        <div className="px-7 py-6">
          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setActiveTab("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]" />}>
      <LoginPageContent />
    </Suspense>
  );
}