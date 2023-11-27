/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));
        let icon = new St.Icon({
          gicon : Gio.icon_new_for_string( Me.dir.get_path() + '/ros_logo.svg' ),
          style_class : 'system-status-icon',
        });
        this.add_child(icon);

        let item = new PopupMenu.PopupMenuItem(_('Change ROS Version:'));
        item.connect('activate', () => {
            //Main.notify(_('Whatʼs up, folks?'));
            log('clicked');
        });
        this.menu.addMenuItem(item);
        
        this.menu.addMenuItem( new PopupMenu.PopupSeparatorMenuItem() );
    
        // image item
        let popupImageMenuItem = new PopupMenu.PopupImageMenuItem(
          'Unset ROS_VERSION',
          Gio.icon_new_for_string( Me.dir.get_path() + '/ros_logo.svg' ),
        );
        popupImageMenuItem.actor.connect('button-press-event', function(){ GLib.spawn_command_line_async('unset ROS_DISTRO') });
        this.menu.addMenuItem(popupImageMenuItem);
        // popupImageMenuItem.actor.connect('button-press-event', function(){Main.notify('Example Notification', 'Hello World !') });
        // GLib.getenv('ROS_DISTRO')

        
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
