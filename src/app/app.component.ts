import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './webSocket/web-socket.service';
import * as d3 from 'd3';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-temp-monitoring';
  subscription: Subscription;


  private data = [{}];
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

 private createSvg(): void {
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
}

private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Room))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 100])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => x(d.Room))
  .attr("y", d => y(d.Temp))
  .attr("width", x.bandwidth())
  .attr("height", (d) => this.height - y(d.Temp))
  .attr("fill", "#d04a35");
}

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {

    this.subscription = this.webSocketService.cretateObservableSocket("wss://11cyf2wu2d.execute-api.us-east-1.amazonaws.com/development")
     // "wss://48p78wylxg.execute-api.us-east-1.amazonaws.com/production")
    .subscribe(  
      data=> {
        const obj = JSON.parse(data);
        const room = obj["state"]["reported"]["location"];
        const temp = obj["state"]["reported"]["temp"];
        console.log("messge from the socket "+ room + " "+ temp);
        this.data.push({"Room": room, "Temp": temp});
      },
      err => console.log("Error from the socket"),
      () => console.log("observable stream is complete")
    );


  }

  onDrawClicked(){
    this.createSvg();
    this.drawBars(this.data);
  }
}
