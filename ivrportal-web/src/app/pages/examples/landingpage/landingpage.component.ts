import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import Chart from "chart.js";
import { AppService } from 'src/app/app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/store/app.store';
import { Store } from 'redux';
import { AppState, DashboardDto } from 'src/app/store/app.state';

@Component({
  selector: "app-landingpage",
  templateUrl: "landingpage.component.html"
})
export class LandingpageComponent implements OnDestroy {
  isCollapsed = true;

  data: DashboardDto = {
    "totalbasecount": 0,
    "todayactivationcount": 0,
    "todaydeactivationcount": 0,
    "totaladvancecategoryContents": 0,
    "totalbasiccategoryContents": 0,
    "yesterdayactivationcount": 0,
    "yesterdaydeactivationcount": 0,

  };

  contentdata = [];
  createdstats = [];
  createdstatslabels = [];
  expiredstats = [];
  expiredstatslabels = [];

  constructor(private service: AppService, @Inject(AppStore) public store: Store<AppState>) {
    try {
      this.service.getDashboardDto("LearnEnglish", (result: DashboardDto) => {
        this.data = result;
      });

    } catch (error) {
      throw new Error("LandingpageComponent::contructor Exception :" + error);

    }
  }


  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }
}
