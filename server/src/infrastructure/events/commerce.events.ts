export class OrderCreatedEvent {
  constructor(public readonly orderId: string) {}
}

export class OrderShippedEvent {
  constructor(
    public readonly email: string,
    public readonly orderCode: string,
    public readonly deliveryCode: string,
    public readonly fullName: string,
  ) {}
}

export class PaymentConfirmedEvent {
  constructor(
    public readonly orderId: string,
    public readonly email: string,
    public readonly detailedOrder: any,
  ) {}
}
