"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_controller_1 = require("./events.controller");
const events_service_1 = require("./events.service");
const sessions_controller_1 = require("./sub-modules/sessions/sessions.controller");
const speakers_controller_1 = require("./sub-modules/speakers/speakers.controller");
const sponsors_controller_1 = require("./sub-modules/sponsors/sponsors.controller");
const venues_controller_1 = require("./sub-modules/venues/venues.controller");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            events_controller_1.EventsController,
            sessions_controller_1.SessionsController,
            speakers_controller_1.SpeakersController,
            sponsors_controller_1.SponsorsController,
            venues_controller_1.VenuesController,
        ],
        providers: [events_service_1.EventsService],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map