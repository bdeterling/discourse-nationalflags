import {h} from 'virtual-dom';
import {withPluginApi} from 'discourse/lib/plugin-api';
import {ajax} from 'discourse/lib/ajax';

// import Ember from 'ember';

function initializeNationalFlags(api, siteSettings) {
  const nationalflagsEnabled = siteSettings.nationalflag_enabled;

  if (!nationalflagsEnabled) {
    return;
  }

  api.decorateWidget('poster-name:after', dec => {
    let flag = 'none';
    let location = '';

    if (dec.attrs && dec.attrs.userCustomFields && dec.attrs.userCustomFields.nationalflag_iso) {
      flag = dec.attrs.userCustomFields.nationalflag_iso;
      // Ember.Logger.debug(result)
    }

    location = dec.getModel().get('user_location');

    if (!flag || flag === 'none') {
      // Ember.Logger.debug('NOT FOUND!')
      if (location && location !== '') {
        return dec.h('span.nationalflag-location', location);
      }
      return;
    }

    if (!location || location === '') {
      return dec.h('img', {
        className: "nationalflag-post",
        attributes: {
          src: "/plugins/discourse-nationalflags/images/nationalflags/" + flag + ".png"
        }
      });
    } else {
      return dec.h('div.nationalflag-container', [
        dec.h('img', {
          className: "nationalflag-post",
          attributes: { src: "/plugins/discourse-nationalflags/images/nationalflags/" + flag + ".png" }
        }),
        dec.h('span.nationalflag-location', location)
      ]);
    }
  });
}

export default {
  name : 'nationalflag',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    withPluginApi('0.1', api => initializeNationalFlags(api, siteSettings));
  }
};
