import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JogoDetailComponent } from './jogo-detail.component';

describe('JogoDetailComponent', () => {
  let component: JogoDetailComponent;
  let fixture: ComponentFixture<JogoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JogoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JogoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
