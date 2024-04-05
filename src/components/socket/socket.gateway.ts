import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { Notification } from 'src/models/notification.model';
import { SocketService } from './socket.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
@WebSocketGateway({ cors: true, })
export class SocketGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly socketService: SocketService) { }

  private extractUserIdFromSocket(socket: Socket): string | null {
    if (socket && socket.handshake && socket.handshake.auth && socket.handshake.auth.token) {
      // Trích xuất userId từ token xác thực
      const token = socket.handshake.auth.token;
      try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) as jwt.JwtPayload
        const userId = decodedToken._id;
        return userId;
      } catch (error) {
        console.error('Error decoding token:', error.message);
        return null;
      }
    } else {
      console.error('Socket does not contain user information');
      return null;
    }
  }

  @SubscribeMessage('connection')
  handleConnection(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ) {
    this.server.emit('connection', socket.id)

    if (userId) {
      this.socketService.setUserSocket(userId, socket.id);
    }
  }

  handleDisconnect(userId: string) {
    this.socketService.removeUserSocket(userId)
  }

  handleComment(@MessageBody() comment: any) {
    if (this.server) {
      this.server.emit('comment', comment);
    } else {
      console.log("Không thể gửi comment, server chưa được khởi tạo.");
    }
  }

  handleReaction(@MessageBody() totalReactions: number) {
    if (this.server) {
      this.server.emit('reaction', totalReactions);
    } else {
      console.log("Không thể gửi reaction, server chưa được khởi tạo.");
    }
  }

  handleNotification(@MessageBody() data: { userId: string, notifications: Notification[] }) {
    const { userId, notifications } = data

    const useSocketId = this.socketService.getUserSocket(String(userId))
    if (useSocketId) {
      if (this.server) {
        this.server.to(useSocketId).emit('notification', notifications);

      } else {
        console.log("Không thể gửi notification, server chưa được khởi tạo.");
      }
    }
  }
}
