import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaPresencaComponent } from './dia-presenca.component';

describe('DiaPresencaComponent', () => {
  let component: DiaPresencaComponent;
  let fixture: ComponentFixture<DiaPresencaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaPresencaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaPresencaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
