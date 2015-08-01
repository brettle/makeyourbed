/// <reference path="../meteor/meteor.d.ts"/>
interface AccountsMeld {
  configure(options:{
    askBeforeMeld?: boolean,
    checkForConflictingServices?: boolean,
    meldUserCallback?: ((src_user:Meteor.User, dst_user:Meteor.User) => Meteor.User),
    meldDBCallback?: ((src_user:Meteor.User, dst_user:Meteor.User) => void),
    serviceAddedCallback?: ((user_id:string, service_name:string)=>void),
    }):void;
}

declare var AccountsMeld: AccountsMeld;
