import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './webSocket/web-socket.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import * as timeFormat from 'd3';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-temp-monitoring';
  subscription: Subscription;


  dataBasement: any[] = [
    
  ];

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>; // this is line defination

  constructor (private webSocketService: WebSocketService) {
    // configure margins and width/height of the graph
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  public ngOnInit(): void {
    this.subscription = this.webSocketService.cretateObservableSocket(
        "wss://11cyf2wu2d.execute-api.us-east-1.amazonaws.com/development")
       // "wss://48p78wylxg.execute-api.us-east-1.amazonaws.com/production")
      .subscribe(  
        data=> {
          const obj = JSON.parse(data);
          const room = obj["state"]["reported"]["location"];
          const temp = obj["state"]["reported"]["temp"];
          const date = obj["metadata"]["reported"]["location"]["timestamp"];
          const dateUpdated = new Date(date * 1000);
          
          console.log("messge from the socket "+ room + " "+ temp + " " + dateUpdated);
          if(room.search(`sunroom`) != -1){
            this.dataBasement.push({"date": dateUpdated, "temp": temp});
          }

          this.dataBasement.forEach(element => {
            console.log(element.date, element.temp);
            
          });
          d3.selectAll("svg > *").remove();

          if (this.dataBasement.length != 0){
            this.buildSvg();
            this.addXandYAxis();
            this.drawLineAndPath();
          }
        },
        err => console.log("Error from the socket"),
        () => console.log("observable stream is complete")
      );

  }
  
  private buildSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis() {

    //Defining time format
    var timeFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S');


    // range of data configuring
    console.log(`width` + this.width + `height` + this.height);
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3.extent(this.dataBasement,  function(d) {
      console.log(`*********************** `+ timeFormat(d.date));
      return timeFormat(d.date);
  }));
    //this.y.domain(d3Array.extent(this.dataBasement, (d) => d.temp ));
    this.y.domain([0, 200]);

    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath() {

    var timeFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S');
    this.line = d3.line()
        .x( (d: any) => this.x(timeFormat(d.date)) )
        .y( (d: any) => this.y(d.temp ));
    // Configuring line path
    this.svg.append('path')
        .datum(this.dataBasement)
        .attr('d', this.line);
  }
}
