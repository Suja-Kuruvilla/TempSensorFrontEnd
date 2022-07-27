import { Observable } from "rxjs";

export class WebSocketService {
    socket: WebSocket;
    socketIsOprn = 1;


    cretateObservableSocket(url: string): Observable<any>{
      this.socket = new WebSocket(url);

      return new Observable(
        observer => {
          this.socket.onmessage = (event)=> {
            console.log("WebSocketService Receiving" + event.data);
            observer.next(event.data);
          }
          this.socket.onerror = (event)=> {
            console.log("WebSocketService On error");
            observer.error(event);
          }
          this.socket.onclose = (event)=>{
            console.log("WebSocketService On Close");
          }
          return ()=> this.socket.close(1000, "this user disconnecte");
        }
      );
    }

    sendRequest(req: string): void{
      this.socket.send(req);
      console.log(`Sending requewt to websocket`);
    }


}


