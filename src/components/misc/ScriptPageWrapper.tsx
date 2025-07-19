import { Suspense, type ReactNode } from "react";
import { ErrorPage } from "../../pages/ErrorPage";
import { ScriptLoadingPage } from "../../pages/ScriptLoadingPage";
import { ErrorBoundary } from "./ErrorBoundary";

export interface ScriptPageWrapperProps {
  children: ReactNode;
}

export function ScriptPageWrapper({ children }: ScriptPageWrapperProps) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<ScriptLoadingPage />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
