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

import * as chai from 'chai';
import { expect } from 'chai';
import { ThreeHelper } from '../../test/three.helper';
import { NodeBinaryReader } from '../io/binary-reader.node';
import { Table } from '../vpt/table/table';
import { Transpiler } from './transpiler';

chai.use(require('sinon-chai'));

/* tslint:disable:no-unused-expression */
describe('The VBScript transpiler', () => {

	const three = new ThreeHelper();
	let table: Table;

	before(async () => {
		table = await Table.load(new NodeBinaryReader(three.fixturePath('table-gate.vpx')));
	});

	it('should wrap everything into a global function', () => {

		const vbs = `Dim test\n`;
		const transpiler = new Transpiler(table);
		const js = transpiler.transpile(vbs, 'runTableScript');
		expect(js).to.equal(`runTableScript = items => {\n    let test;\n};`);
	});

	it('should wrap everything into a function of an object', () => {

		const vbs = `Dim test\n`;
		const transpiler = new Transpiler(table);
		const js = transpiler.transpile(vbs, 'runTableScript', 'window');
		expect(js).to.equal(`window.runTableScript = items => {\n    let test;\n};`);
	});

});