import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebSocketService} from './webSocket/web-socket.service';
import { DataCollectedIndbComponent } from './data-collected-indb/data-collected-indb.component';

@NgModule({
  declarations: [
    AppComponent,
    DataCollectedIndbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
