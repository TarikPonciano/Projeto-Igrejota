import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JogoEditComponent } from './jogo-edit.component';

describe('JogoEditComponent', () => {
  let component: JogoEditComponent;
  let fixture: ComponentFixture<JogoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JogoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JogoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
