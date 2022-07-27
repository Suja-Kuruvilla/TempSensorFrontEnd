import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectedIndbComponent } from './data-collected-indb.component';

describe('DataCollectedIndbComponent', () => {
  let component: DataCollectedIndbComponent;
  let fixture: ComponentFixture<DataCollectedIndbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCollectedIndbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCollectedIndbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
