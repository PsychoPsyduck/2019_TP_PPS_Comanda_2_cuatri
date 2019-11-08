import { TestBed } from '@angular/core/testing';

import { TomarPedidoService } from './tomar-pedido.service';

describe('TomarPedidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TomarPedidoService = TestBed.get(TomarPedidoService);
    expect(service).toBeTruthy();
  });
});
