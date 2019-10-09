/*
 * VPDB - Virtual Pinball Database
 * Copyright (C) 2019 freezy <freezy@vpdb.io>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

import { EventProxy } from '../../game/event-proxy';
import { Player } from '../../game/player';
import { ItemApi } from '../item-api';
import { Table } from '../table/table';
import { BumperAnimation } from './bumper-animation';
import { BumperData } from './bumper-data';

export class BumperApi extends ItemApi<BumperData> {

	private readonly animation: BumperAnimation;

	constructor(animation: BumperAnimation, data: BumperData, events: EventProxy, player: Player, table: Table) {
		super(data, events, player, table);
		this.animation = animation;
	}

	get Radius() { return this.data.radius; }
	set Radius(v) { this.data.radius = v; }
	get Force() { return this.data.force; }
	set Force(v) { this.data.force = v; }
	get Scatter() { return this.data.scatter; }
	set Scatter(v) { this.data.scatter = v; }
	get HeightScale() { return this.data.heightScale; }
	set HeightScale(v) { this.data.heightScale = v; }
	get RingSpeed() { return this.data.ringSpeed; }
	set RingSpeed(v) { this.data.ringSpeed = v; }
	get RingDropOffset() { return this.data.ringDropOffset; }
	set RingDropOffset(v) { this.data.ringDropOffset = v; }
	get Orientation() { return this.data.orientation; }
	set Orientation(v) { this.data.orientation = v; }
	get Threshold() { return this.data.threshold; }
	set Threshold(v) { this.data.threshold = v; }
	get CapMaterial() { return this.data.szCapMaterial; }
	set CapMaterial(v) { this.data.szCapMaterial = v; }
	get RingMaterial() { return this.data.szRingMaterial; }
	set RingMaterial(v) { this.data.szRingMaterial = v; }
	get BaseMaterial() { return this.data.szBaseMaterial; }
	set BaseMaterial(v) { this.data.szBaseMaterial = v; }
	get SkirtMaterial() { return this.data.szSkirtMaterial; }
	set SkirtMaterial(v) { this.data.szSkirtMaterial = v; }
	get X() { return this.data.center.x; }
	set X(v) { this.data.center.x = v; }
	get Y() { return this.data.center.y; }
	set Y(v) { this.data.center.y = v; }
	get Surface() { return this.data.szSurface; }
	set Surface(v) { this.data.szSurface = v; }
	get HasHitEvent() { return this.data.hitEvent; }
	set HasHitEvent(v) { this.data.hitEvent = v; }
	get Collidable() { return this.data.isCollidable; }
	set Collidable(v) { this.data.isCollidable = v; }
	get CapVisible() { return this.data.isCapVisible; }
	set CapVisible(v) { this.data.isCapVisible = v; }
	get BaseVisible() { return this.data.isBaseVisible; }
	set BaseVisible(v) { this.data.isBaseVisible = v; }
	get RingVisible() { return this.data.isRingVisible; }
	set RingVisible(v) { this.data.isRingVisible = v; }
	get SkirtVisible() { return this.data.isSkirtVisible; }
	set SkirtVisible(v) { this.data.isSkirtVisible = v; }
	get ReflectionEnabled() { return this.data.isReflectionEnabled; }
	set ReflectionEnabled(v) { this.data.isReflectionEnabled = v; }
	get EnableSkirtAnimation() { return this.animation.enableSkirtAnimation; }
	set EnableSkirtAnimation(v) { this.animation.enableSkirtAnimation = v; }

	public PlayHit() {
		this.animation.hitEvent = true;
	}

	/**
	 * No idea wtf this is supposed to do.
	 */
	public InterfaceSupportsErrorInfo(riid: any): boolean {
		return false;
	}
}