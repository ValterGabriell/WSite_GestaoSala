import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtribuicoesComponent } from './atribuicoes.component';

describe('AtribuicoesComponent', () => {
  let component: AtribuicoesComponent;
  let fixture: ComponentFixture<AtribuicoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtribuicoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtribuicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
