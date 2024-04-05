import { Injectable } from '@nestjs/common';
import { MessageBody, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'

@Injectable()
@WebSocketGateway({ cors: true, })
export class SocketGateway {
  @WebSocketServer()
  server: Server

  // @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
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
      console.log("Không thể gửi comment, server chưa được khởi tạo.");
    }
  }
}
