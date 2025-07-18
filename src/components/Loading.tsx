interface LoadingProps {
  isLoading?: boolean;
}
export function Loading({ isLoading }: LoadingProps) {
  return isLoading ? (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando aplicação...</p>
      </div>
    </div>
  ) : (
    <></>
  );
}
