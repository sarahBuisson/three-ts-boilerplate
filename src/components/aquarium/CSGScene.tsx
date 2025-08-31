import React from 'react';
import { BoxGeometry, Mesh, MeshNormalMaterial, SphereGeometry } from 'three';
import { CSG } from 'three-csg-ts';

const box = new Mesh(
    new BoxGeometry(2, 2, 2),
    new MeshNormalMaterial()
  );
 const sphere = new Mesh(
    new SphereGeometry(1.2, 8, 8),
    new MeshNormalMaterial()
  );

export function CSGScene(){


return <><mesh geometry={CSG.subtract(box, sphere)}></mesh></>

}
