
import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
    return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )
}
