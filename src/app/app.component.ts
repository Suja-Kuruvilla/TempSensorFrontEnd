import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService } from './webSocket/web-socket.service';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import * as timeFormat from 'd3';

/**This code needs refactoring to make use of code reuse for sure */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Location1 = ``;
  Location2 = ``;
  subscription: Subscription;
  ItemsFromDb : [];


  dataLocation1: any[] = [
    
  ];

  dataLocation2: any[] = [
    
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
            if (obj["state"]  != undefined) {
                const room = obj["state"]["reported"]["location"];
                const temp = obj["state"]["reported"]["temp"];
                const date = obj["metadata"]["reported"]["location"]["timestamp"];
                const dateUpdated = new Date(date * 1000);
                
                console.log("messge from the socket "+ room + " "+ temp + " " + dateUpdated);
                if(room.search(`sunroom`) != -1){
                  this.Location1 = `SunRoom`;
                  this.dataLocation1.push({"date": dateUpdated, "temp": Math.round(temp).toFixed(1)});
                }

                if(room.search(`basement`) != -1){
                  this.Location2 = `Basement`;
                  this.dataLocation2.push({"date": dateUpdated, "temp": Math.round(temp).toFixed(1)});
                }

                console.log(`****************************** Location1 **************************`);
                this.dataLocation1.forEach(element => {
                  console.log(element.date, element.temp);
                  
                });

                console.log(`****************************** Location2 **************************`);
                this.dataLocation2.forEach(element => {
                  console.log(element.date, element.temp);
                  
                });

                d3.selectAll("svg > *").remove();

                if (this.dataLocation1.length != 0){
                  this.buildSvg();
                  this.addXandYAxis();
                  this.drawLineAndPath();
                }

                if (this.dataLocation2.length != 0){
                  this.buildSvgLocation2();
                  this.addXandYAxisLocation2();
                  this.drawLineAndPathLocation2();
                }
              }
              else if(obj["dbData"] != undefined) {
                this.ItemsFromDb = obj["dbData"]["Items"];
                console.log(`Items in ItemsFromDb` + this.ItemsFromDb.length);
              }
            },
            err => console.log("Error from the socket"),
            () => console.log("observable stream is complete")
          );
  
    }

  
  private buildSvg() {
    this.svg = d3.select("#location1")
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
    this.x.domain(d3.extent(this.dataLocation1, (d) => d.date));
      
      /*function(d) {
      console.log(`*********************** `+ timeFormat(d.date));
      return timeFormat(d.date);
  }));*/
    //this.y.domain(d3Array.extent(this.dataBasement, (d) => d.temp ));
    //this.y.domain(d3.extent(this.dataBasement, (d) => d.temp));
    this.y.domain([60, 80]);
    // Configure the X Axis

    this.svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3Axis.axisBottom(this.x));

   // d3.axisBottom<Date>(this.x).tickFormat(d3.timeFormat(`%Y-%m-%dT%H:%M:%S`));




      
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath() {
    var timeFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S');
    this.line = d3.line()
        .x( (d: any) => this.x(d.date))
        .y( (d: any) => this.y(d.temp ));
    // Configuring line path
    this.svg.append('path')
        .datum(this.dataLocation1)
        .attr('d', this.line);
  }

  private buildSvgLocation2() {
    this.svg = d3.select("#location2")
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxisLocation2() {
    // range of data configuring
    console.log(`width` + this.width + `height` + this.height);
    this.x = d3Scale.scaleTime().range([0, this.width]);
  
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3.extent(this.dataLocation2, (d) => d.date));
    this.y.domain([60, 80]);
    // Configure the X Axis

    this.svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3Axis.axisBottom(this.x));

    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPathLocation2() {
    var timeFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S');
    this.line = d3.line()
        .x( (d: any) => this.x(d.date))
        .y( (d: any) => this.y(d.temp ));
    // Configuring line path
    this.svg.append('path')
        .datum(this.dataLocation2)
        .attr('d', this.line);
  }


  GetTemps(){
    var obj = new Object();
     obj["action"] = "GetTemps";

   var jsonString= JSON.stringify(obj);
    this.webSocketService.sendRequest(JSON.stringify(obj));
  }
}
