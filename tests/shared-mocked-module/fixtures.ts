import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'my-component',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]: false,
  template: 'real content',
})
export class MyComponent {}

@Component({
  selector: 'child-1-component',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]: false,
  template: 'child:1 <my-component></my-component>',
})
export class Child1Component {}

@Component({
  selector: 'child-2-component',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]: false,
  template: 'child:2 <my-component></my-component>',
})
export class Child2Component {}

@Component({
  selector: 'target-component',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]: false,
  template: '<child-1-component></child-1-component> - <child-2-component></child-2-component>',
})
export class TargetComponent {}

@NgModule({
  declarations: [MyComponent],
  exports: [MyComponent],
})
export class MyModule {}

@NgModule({
  declarations: [Child1Component],
  exports: [Child1Component],
  imports: [MyModule],
})
export class Child1Module {}

@NgModule({
  declarations: [Child2Component],
  exports: [Child2Component],
  imports: [MyModule],
})
export class Child2Module {}

@NgModule({
  declarations: [TargetComponent],
  exports: [TargetComponent],
  imports: [CommonModule, Child1Module, Child2Module],
})
export class TargetModule {}
