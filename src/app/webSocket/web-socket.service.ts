import { Observable } from "rxjs";

export class WebSocketService {
    socket: WebSocket;
    socketIsOprn = 1;


    cretateObservableSocket(url: string): Observable<any>{
      this.socket = new WebSocket(url);

      return new Observable(
        observer => {
          this.socket.onmessage = (event)=> {
            console.log("Receiving" + event.data);
            observer.next(event.data);
          }
          this.socket.onerror = (event)=> {
            console.log("On error");
            observer.error(event);
          }
          return ()=> this.socket.close(1000, "this user disconnecte");
        }
      );
    }


}


