import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JogosDestaqueComponent } from './jogos-destaque.component';

describe('JogosDestaqueComponent', () => {
  let component: JogosDestaqueComponent;
  let fixture: ComponentFixture<JogosDestaqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JogosDestaqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JogosDestaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
