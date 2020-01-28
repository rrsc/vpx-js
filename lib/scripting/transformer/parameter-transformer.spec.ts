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
import { ScriptHelper } from '../../../test/script.helper';
import { ParameterTransformer } from './parameter-transformer';

chai.use(require('sinon-chai'));

/* tslint:disable:no-unused-expression */
describe('The scripting parameter transformer', () => {
	it('should update params for a sub declaration', () => {
		const vbs = `Private Sub foo(ByRef x, ByVal y)\nx = "returned"\ny = 2\ny = y + 2\nx = x & "Bar"\nEnd Sub`;
		const js = transform(vbs);
		expect(js).to.equal(
			`function foo(__params) {\n    let y = __params[1];\n    __params[0] = 'returned';\n    y = 2;\n    y = y + 2;\n    __params[0] = __params[0] + 'Bar';\n}`,
		);
	});

	it('should update params for a function declaration', () => {
		const vbs = `Private Function foo(ByRef x, ByVal y)\nx = "returned"\ny = 2\ny = y + 2\nx = x & "Bar"\nEnd Function`;
		const js = transform(vbs);
		expect(js).to.equal(
			`function foo(__params) {\n    let foo = undefined;\n    let y = __params[1];\n    __params[0] = 'returned';\n    y = 2;\n    y = y + 2;\n    __params[0] = __params[0] + 'Bar';\n    return foo;\n}`,
		);
	});

	it('should treat params as ByRef when not explicitly stated', () => {
		const vbs = `Private Function foo(x, ByVal y)\nx = "returned"\ny = 2\ny = y + 2\nx = x & "Bar"\nEnd Function`;
		const js = transform(vbs);
		expect(js).to.equal(
			`function foo(__params) {\n    let foo = undefined;\n    let y = __params[1];\n    __params[0] = 'returned';\n    y = 2;\n    y = y + 2;\n    __params[0] = __params[0] + 'Bar';\n    return foo;\n}`,
		);
	});

	it('should not update when no params', () => {
		const vbs = `Private Sub foo\nx = "returned"\ny = 2\ny = y + 2\nx = x & "Bar"\nEnd Sub`;
		const js = transform(vbs);
		expect(js).to.equal(
			`function foo() {\n    x = 'returned';\n    y = 2;\n    y = y + 2;\n    x = x + 'Bar';\n}`,
		);
	});

	it('should update params in class functions', () => {
		const vbs = `Class cvpmTest\nPrivate mEnabled\nPublic Property Get Balls(test, ByVal test2):mEnabled=test:Balls=mEnabled:If Balls=1 Then Exit Property:End Property\nEnd Class`;
		const js = transform(vbs);
		expect(js).to.equal(
			`class cvpmTest {\n    constructor() {\n        this.mEnabled = undefined;\n    }\n    Balls(__params) {\n        let test2 = __params[1];\n        let Balls = undefined;\n        this.mEnabled = __params[0];\n        Balls = this.mEnabled;\n        if (__vbs.equals(Balls, 1)) {\n            return Balls;\n        }\n        return Balls;\n    }\n}`,
		);
	});

	it.only('should run pack and unpack identifiers params before function calls', () => {
		const vbs = 'vpmSetArray tmp, aKicker';
		const js = transform(vbs);
		expect(js).to.equal(
			`const __args0 = [\n    tmp,\n    aKicker\n];\nvpmSetArray(__args0);\n[tmp, aKicker] = __args0;`,
		);
	});

	it.only('should run pack but not unpack literals params before function calls', () => {
		const vbs = 'vpmSetArray tmp, 2, tmp2';
		const js = transform(vbs);
		expect(js).to.equal(
			`const __args0 = [\n    tmp,\n    2,\n    tmp2\n];\nvpmSetArray(__args0);\n[tmp, , tmp2] = __args0;`,
		);
	});

	it.only('should run pack and unpack nested params before function calls', () => {
		const vbs = 'vpmSetArray tmp, foo(tmp2)';
		const js = transform(vbs);
		expect(js).to.equal(
			`const __args1 = [tmp2];\nconst __args0 = [\n    tmp,\n    foo(__args1)\n];\nvpmSetArray(__args0);\n[tmp, ,] = __args0;\n[tmp2] = __args1;`,
		);
	});

	it.only('should run pack and unpack a function expression', () => {
		const vbs = 'if vpmSetArray(tmp) then\nend if';
		const js = transform(vbs);
		expect(js).to.equal(
			`const __args0 = [tmp];\nif (vpmSetArray(__args0)) {\n    [tmp] = __args0;\n}`,
		);
	});
});

function transform(vbs: string): string {
	const scriptHelper = new ScriptHelper();
	let ast = scriptHelper.vbsToAst(vbs);
	ast = new ParameterTransformer(ast).transform();
	return scriptHelper.astToVbs(ast);
}
