declare module Inject {
  function meta(id:string, textOrFunc:string|Function, response?): void;
  function rawHead(id:string, textOrFunc:string|Function, response?): void;
}
