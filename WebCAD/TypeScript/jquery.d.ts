

declare module "jquery" {
    export = $;
}


declare module $
{
    
    

    interface JQueryEventObject{}
    interface JQuery{}

    // function on(...args): any;
    function on(events: string, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    function on(events: string, data : any, handler: (eventObject: JQueryEventObject, ...args: any[]) => any): JQuery;
    function on(events: string, selector: string, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    function on(events: string, selector: string, data: any, handler: (eventObject: JQueryEventObject, ...eventData: any[]) => any): JQuery;
    function on(events: { [key: string]: (eventObject: JQueryEventObject, ...args: any[]) => any; }, selector?: string, data?: any): JQuery;
    function on(events: { [key: string]: (eventObject: JQueryEventObject, ...args: any[]) => any; }, data?: any): JQuery;
    
}
