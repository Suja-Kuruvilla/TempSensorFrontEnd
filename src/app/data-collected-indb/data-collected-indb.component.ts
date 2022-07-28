import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange  } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

@Component({
  selector: 'app-data-collected-indb',
  templateUrl: './data-collected-indb.component.html',
  styleUrls: ['./data-collected-indb.component.css']
})
export class DataCollectedIndbComponent implements OnInit, OnChanges {

  @Input() dataFromDb : any = [];
  dataLocation1: any[] = [
    
  ];


  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>; // this is line defination
  constructor() { 
    this.width = 2000 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChanges){
     // console.log(this.dataFromDb);
     var temparray : any = [];
     for (var i=0; i<this.dataFromDb.length; i++) {
        const obj = this.dataFromDb[i];
        console.log(obj);
        const location = obj["location_name"];
        if (location.search(`sunroom`) != -1){
         
          temparray.push({"date": obj["sample_time"], "temp": Math.round(obj["temp"]).toFixed(1)});


        }
      };
      temparray.sort((a, b) => a.date > b.date ? 1 : -1);
      for (var i=0; i<temparray.length; i++) {
         const dateUpdated = new Date(temparray[i].date * 1000);
         this.dataLocation1.push({"date": dateUpdated, "temp": Math.round(temparray[i].temp).toFixed(1)});
      }
      
      this.dataLocation1.forEach(element => {
        console.log(element.date, element.temp);
        
      });

      if (this.dataLocation1.length != 0){
        this.buildSvg();
        this.addXandYAxis();
        this.drawLineAndPath();
      }
  }



  private buildSvg() {
    this.svg = d3.select("#fromDb")
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis() {

    //Defining time format
    var timeFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S');


    // range of data configuring
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

    var xAxis = d3.axisBottom<Date>(this.x).tickFormat(d3.timeFormat(`%m/%d/%Y %H:%M`)).ticks(50);
    this.svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");




      
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


}
