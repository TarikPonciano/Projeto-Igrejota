import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaHighlightComponent } from './noticia-highlight.component';

describe('NoticiaHighlightComponent', () => {
  let component: NoticiaHighlightComponent;
  let fixture: ComponentFixture<NoticiaHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
