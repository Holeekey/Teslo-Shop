import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { MessagesWsService } from './messages-ws.service';
import { Socket,Server } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService:JwtService
    ) {}
  
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client,payload.id)

    } catch (error) {

      client.disconnect();
      return;

    }

    //(console.log(payload)
    
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){

    //Emite únicamente al cliente que emitió el evento
    /* client.emit('message-from-server',{
      fullName: 'Soy yo',
      message: payload.message || 'no-message'
    }) */

    //Emite a todos menos al cliente inicial
    /* client.broadcast.emit('message-from-server',{
      fullName: 'Soy yo',
      message: payload.message || 'no-message'
    })  */

    //Emitir a todos
    this.wss.emit('message-from-server',{
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || 'no-message'
    }) 

  }

}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5NWYzZTRlLTE5NDktNGQzMy04OWNlLThjZjY5MDY2MjU0ZSIsImlhdCI6MTY4MDc1NTIwOCwiZXhwIjoxNjgwNzYyNDA4fQ.IIL7py1vaW78gTevk5U4c8k6qVWwLaQ7LKHWMqNnidk