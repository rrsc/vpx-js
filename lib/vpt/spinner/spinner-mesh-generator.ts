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

import { degToRad, f4 } from '../../math/float';
import { Matrix3D } from '../../math/matrix3d';
import { Vertex3D } from '../../math/vertex3d';
import { Mesh } from '../mesh';
import { Table } from '../table/table';
import { SpinnerData } from './spinner-data';

const spinnerBracketMesh = Mesh.fromJson(require('../../../res/meshes/spinner-bracket-mesh'));
const spinnerPlateMesh = Mesh.fromJson(require('../../../res/meshes/spinner-plate-mesh'));

export class SpinnerMeshGenerator {

	private readonly data: SpinnerData;

	constructor(data: SpinnerData) {
		this.data = data;
	}

	public generateMeshes(table: Table): { plate: Mesh, bracket: Mesh } {
		const posZ = this.getZ(table);
		return {
			plate: this.getPlateMesh(table, posZ),
			bracket: this.getBracketMesh(table, posZ),
		};
	}

	public getZ(table: Table): number {
		const height = table.getSurfaceHeight(this.data.szSurface, this.data.center.x, this.data.center.y) * table.getScaleZ();
		return f4(height + this.data.height);
	}

	private getPlateMesh(table: Table, posZ: number): Mesh {
		const mesh = spinnerPlateMesh.clone(`spinner.plate-${this.data.getName()}`);
		return this.updateVertices(table, posZ, mesh);
	}

	private getBracketMesh(table: Table, posZ: number): Mesh {
		const bracketMesh = spinnerBracketMesh.clone(`spinner.bracket-${this.data.getName()}`);
		return this.updateVertices(table, posZ, bracketMesh);
	}

	private updateVertices(table: Table, posZ: number, mesh: Mesh): Mesh {
		const matrix = new Matrix3D().rotateZMatrix(degToRad(this.data.rotation));
		for (const vertex of mesh.vertices) {
			const vert = Vertex3D.claim(vertex.x, vertex.y, vertex.z).multiplyMatrix(matrix);
			vertex.x = f4(vert.x * this.data.length) + this.data.center.x;
			vertex.y = f4(vert.y * this.data.length) + this.data.center.y;
			vertex.z = f4(f4(vert.z * this.data.length) * table.getScaleZ()) + posZ;

			const normal = Vertex3D.claim(vertex.nx, vertex.ny, vertex.nz).multiplyMatrixNoTranslate(matrix);
			vertex.nx = normal.x;
			vertex.ny = normal.y;
			vertex.nz = normal.z;

			Vertex3D.release(vert, normal);
		}
		return mesh;
	}
}
