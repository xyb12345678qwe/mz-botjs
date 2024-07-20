/**
 * MzPlugin 类定义
 */
export declare class MzPlugin {
  e: any;
  name: string;
  acount: number;
  example: string;
  event: string;
  typing: string;
  rule: Array<{
    reg: RegExp | string;
    fnc: string;
  }>;
  priority: number;

  constructor(init?: {
    event?: string;
    typing?: string;
    priority?: number;
    rule?: Array<{
      reg: RegExp | string;
      fnc: string;
    }>;
  });

  reply(content: string): Promise<boolean>;
}