import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaEditComponent } from './noticia-edit.component';

describe('NoticiaEditComponent', () => {
  let component: NoticiaEditComponent;
  let fixture: ComponentFixture<NoticiaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
