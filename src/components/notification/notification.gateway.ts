import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'
import { Notification } from 'src/models/notification.model';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleNotification(@MessageBody() notifications: Notification[]) {
    if (this.server) {
      this.server.emit('notification', notifications);
    } else {
      console.log("Không thể gửi comment, server chưa được khởi tạo.");
    }
  }
}
