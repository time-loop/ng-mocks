import { Component, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
  MockBuilder,
  MockProvider,
  MockRender,
  ngMocks,
} from 'ng-mocks';

@Component({
  selector: 'target',
  ['standalone' as never /* TODO: remove after upgrade to a14 */]:
    false,
  template: `
    <div
      [innerHTML]="sanitizer.sanitize(1, '<strong>value1</strong>')"
    ></div>
  `,
})
class TargetComponent {
  public constructor(public readonly sanitizer: DomSanitizer) {}

  public targetMockSanitizer() {}
}

describe('MockSanitizer', () => {
  beforeEach(() => MockBuilder(TargetComponent));

  it('renders expected mock values', () => {
    MockRender(TargetComponent, null, {
      providers: [
        MockProvider(DomSanitizer, {
          sanitize: (context: SecurityContext, value: string) =>
            `sanitized:${context}:${value.length}`,
        }),
      ],
    });

    expect(ngMocks.formatHtml(ngMocks.find('div'))).toEqual(
      'sanitized:1:23',
    );
  });
});
