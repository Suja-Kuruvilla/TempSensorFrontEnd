import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './webSocket/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-temp-monitoring';
  subscription: Subscription;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.subscription = this.webSocketService.cretateObservableSocket("wss://48p78wylxg.execute-api.us-east-1.amazonaws.com/production")
    .subscribe(
      data=> console.log("messge from the socket")
    );
  }
}
