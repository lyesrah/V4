import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export function NotificationItem({ title, message, timestamp, isRead }: NotificationItemProps) {
  return (
    <Card className={`mb-4 ${isRead ? 'bg-muted/50' : 'bg-background'}`}>
      <CardContent className="flex items-start space-x-4 pt-6">
        <div className="flex-shrink-0">
          <Bell className={`h-6 w-6 ${isRead ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-medium leading-none">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}