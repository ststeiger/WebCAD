// For TypeScript 3.1: 
// https://github.com/BabylonJS/Babylon.js/issues/5277
// interface Screen { readonly orientation: ScreenOrientation;
// interface Document {      readonly fullscreen: boolean;


// https://www.typescriptlang.org/docs/handbook/modules.html
// https://doc.babylonjs.com/snippets/house_use


// https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
// https://www.typescriptlang.org/docs/handbook/modules.html
// https://stackoverflow.com/questions/43783307/how-to-import-jquery-into-a-typescript-file


// https://github.com/oktinaut/babylonjs-typescript-starter/blob/master/src/Materials/SampleMaterial.ts
// https://github.com/oktinaut/babylonjs-typescript-starter/blob/master/src/index.ts
// https://github.com/winksaville/babylon-typescript-example


// import * as BABYLON from "babylonjs";
// import * as Earcut from "earcut";

// import "./BabylonJS/babylon.js";

/*
declare global 
{

    module BABYLON
    {

        interface PolygonMeshBuilder 
        {
            wallBuilder: any;
        }
    }

}
*/

// declare var Earcut: any;

declare namespace BABYLON
{
    interface PolygonMeshBuilder
    {
        wallBuilder: any;
    }
}


// https://github.com/mapbox/earcut/blob/master/src/earcut.js
//declare var Earcut: any;


namespace Babylon.Examples.No2
{

    /******* Add the create scene function ******/
    // https://github.com/BabylonJS/Babylon.js/blob/master/src/Meshes/meshBuilder.ts
    BABYLON.PolygonMeshBuilder.prototype.wallBuilder = function (w0: any, w1: any)
    {
        var positions: any[] = [];
        var iuvs = [];
        var euvs = [];
        var icolors = [];
        var ecolors = [];
        var direction = w1.corner.subtract(w0.corner).normalize();
        var angle = Math.acos(direction.x);
        if (direction.z != 0)
        {
            angle *= direction.z / Math.abs(direction.z);
        }


        this._points.elements.forEach(function (p: BABYLON.Vector3)
        {
            positions.push(p.x * Math.cos(angle) + w0.corner.x, p.y, p.x * Math.sin(angle) + w0.corner.z);
        });
        var indices = [];


        var res: number[] = <number[]><any>Earcut.earcut(this._epoints, this._eholes, 2);
        for (var i = res.length; i > 0; i--)
        {
            indices.push(res[i - 1]);
        }
        ;
        return {positions: positions, indices: indices};
    };


    // Keyboard-controls:
    // Zoom: ALT + UP/DOWN
    // Move: CTRL + UP/DOWN/LEFT/RIGHT
    // Rotate (around origin?): UP/DOWN/LEFT/RIGHT


    //class Corner {
    //    private x: number;
    //    private y: number;
    //    private z: number;


    //    constructor(x?: number, y?: number, z?: number) {
    //        this.x = x||0;
    //        this.y = y || 0;
    //        this.z = z || 0;
    //    }
    //}


    class Door
    {
        private width: number;
        private height: number;
        private left: number;


        constructor(width: number, height: number)
        {
            this.width = width;
            this.height = height;
            this.left = 0;
        }
    }


    class DoorSpace
    {
        private door: Door;
        public left: number;


        constructor(door: Door, left: number)
        {
            this.door = door;
            this.left = left;
        }
    }


    class MyWindow
    {
        private width: number;
        private height: number;
        private left: number;
        private bottom: number;


        constructor(width: number, height: number)
        {
            this.width = width;
            this.height = height;
            this.left = 0;
            this.bottom = 0;
        }
    }


    class WindowSpace
    {
        private window: MyWindow;
        private left: number;
        private top: number;


        constructor(window: MyWindow, left: number, top: number)
        {
            this.window = window;
            this.left = left;
            this.top = top;
        }
    }


    class Wall
    {
        private corner: BABYLON.Vector3;
        public doorSpaces: any[];
        public windowSpaces: any[];


        constructor(corner: BABYLON.Vector3, doorSpaces?: any[], windowSpaces?: any[])
        {
            this.corner = corner;
            this.doorSpaces = doorSpaces || [];
            this.windowSpaces = windowSpaces || [];
        }
    }


    var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement)
    {
        var scene = new BABYLON.Scene(engine);

        // camera
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);

        var corner = function (x: number, y: number)
        {
            return new BABYLON.Vector3(x, 0, y);
        }


        var buildFromPlan = function (walls: any, ply: any, height: number, options: any, scene: BABYLON.Scene)
        {
            // ply: thickness of the walls
            
            //Arrays for vertex positions and indices
            var positions: any[] = [];
            var indices: any[] = [];
            var uvs: any[] = [];
            var colors: any[] = [];

            var interiorUV = options.interiorUV || new BABYLON.Vector4(0, 0, 1, 1);
            var exteriorUV = options.exteriorUV || new BABYLON.Vector4(0, 0, 1, 1);

            var interiorColor = options.interiorColor || new BABYLON.Color4(1, 1, 1, 1);
            var exteriorColor = options.exteriorColor || new BABYLON.Color4(1, 1, 1, 1);
            var interior = options.interior || false;
            if (!interior)
            {
                walls.push(walls[0]);
            }

            var interiorIndex;

            //Arrays to hold wall corner data
            var innerBaseCorners = [];
            var outerBaseCorners = [];
            var innerTopCorners = [];
            var outerTopCorners = [];
            var innerDoorCorners = [];
            var outerDoorCorners = [];
            var innerWindowCorners = [];
            var outerWindowCorners = [];

            var angle = 0;
            var direction = 0;

            var line = BABYLON.Vector3.Zero();
            var nextLine = BABYLON.Vector3.Zero();

            var nbWalls = walls.length;
            if (nbWalls === 2)
            {
                walls[1].corner.subtractToRef(walls[0].corner, line);
                let lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                line.normalize();
                innerBaseCorners[0] = walls[0].corner;
                outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply));
                innerBaseCorners[1] = walls[1].corner;
                outerBaseCorners[1] = walls[1].corner.add(lineNormal.scale(ply));
            } else if (nbWalls > 2)
            {
                for (var w = 0; w < nbWalls - 1; w++)
                {
                    walls[w + 1].corner.subtractToRef(walls[w].corner, nextLine);
                    angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
                    direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
                    let lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                    line.normalize();
                    innerBaseCorners[w] = walls[w].corner
                    outerBaseCorners[w] = walls[w].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply / Math.tan(angle / 2)));
                    line = nextLine.clone();
                }
                if (interior)
                {
                    let lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                    line.normalize();
                    innerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner
                    outerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner.add(lineNormal.scale(ply));
                    walls[1].corner.subtractToRef(walls[0].corner, line);
                    let lineNormal1 = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                    line.normalize();
                    innerBaseCorners[0] = walls[0].corner;
                    outerBaseCorners[0] = walls[0].corner.add(lineNormal1.scale(ply));
                } else
                {
                    walls[1].corner.subtractToRef(walls[0].corner, nextLine);
                    angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
                    direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
                    let lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                    line.normalize();
                    innerBaseCorners[0] = walls[0].corner
                    outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply / Math.tan(angle / 2)));
                    innerBaseCorners[nbWalls - 1] = innerBaseCorners[0];
                    outerBaseCorners[nbWalls - 1] = outerBaseCorners[0]

                }
            }

            // inner and outer top corners
            for (var w = 0; w < nbWalls; w++)
            {
                innerTopCorners.push(new BABYLON.Vector3(innerBaseCorners[w].x, height, innerBaseCorners[w].z));
                outerTopCorners.push(new BABYLON.Vector3(outerBaseCorners[w].x, height, outerBaseCorners[w].z));
            }

            var maxL = 0;
            for (w = 0; w < nbWalls - 1; w++)
            {
                maxL = Math.max(innerBaseCorners[w + 1].subtract(innerBaseCorners[w]).length(), maxL);
            }

            var maxH = height; // for when gables introduced

            /******House Mesh Construction********/

                // Wall Construction
            var polygonCorners;
            var polygonTriangulation;
            var wallData;
            var wallDirection = BABYLON.Vector3.Zero();
            var wallNormal = BABYLON.Vector3.Zero();
            var wallLength: number;
            var exteriorWallLength;
            var doorData;
            var windowData;
            var uvx, uvy;
            var wallDiff: any;

            var compareLeft = function (a: DoorSpace, b: DoorSpace): number
            {
                return a.left - b.left
            }


            for (var w = 0; w < nbWalls - 1; w++)
            {
                walls[w + 1].corner.subtractToRef(walls[w].corner, wallDirection);
                wallLength = wallDirection.length();
                wallDirection.normalize();
                wallNormal.x = wallDirection.z;
                wallNormal.z = -1 * wallDirection.x;
                exteriorWallLength = outerBaseCorners[w + 1].subtract(outerBaseCorners[w]).length();
                wallDiff = exteriorWallLength - wallLength;
                var gableHeight = 0;


                //doors
                if (walls[w].doorSpaces)
                {
                    walls[w].doorSpaces.sort(compareLeft);
                }
                var doors = walls[w].doorSpaces.length;

                //Construct INNER wall polygon starting from (0, 0) using wall length and height and door data
                polygonCorners = [];
                polygonCorners.push(new BABYLON.Vector2(0, 0));

                for (var d = 0; d < doors; d++)
                {
                    polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, 0));
                    polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, walls[w].doorSpaces[d].door.height));
                    polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, walls[w].doorSpaces[d].door.height));
                    polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, 0));
                }

                polygonCorners.push(new BABYLON.Vector2(wallLength, 0));
                polygonCorners.push(new BABYLON.Vector2(wallLength, height));
                polygonCorners.push(new BABYLON.Vector2(0, height));

                //Construct triangulation of polygon using its corners
                polygonTriangulation = new BABYLON.PolygonMeshBuilder("", polygonCorners, scene);

                //windows
                //Construct holes and add to polygon from window data
                var windows = walls[w].windowSpaces.length;
                var holes = [];
                for (var ws = 0; ws < windows; ws++)
                {
                    var holeData = [];
                    holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
                    holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
                    holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top));
                    holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top));
                    holes.push(holeData);
                }

                for (var h = 0; h < holes.length; h++)
                {
                    polygonTriangulation.addHole(holes[h]);
                }


                // wallBuilder produces wall vertex positions array and indices using the current and next wall to rotate and translate vertex positions to correct place
                wallData = polygonTriangulation.wallBuilder(walls[w], walls[w + 1]);

                let nbIndices: number = positions.length / 3; // current number of indices

                // polygonTriangulation._points.
                polygonTriangulation["_points"].elements.forEach(function (p: BABYLON.Vector3)
                {
                    uvx = interiorUV.x + p.x * (interiorUV.z - interiorUV.x) / maxL;
                    uvy = interiorUV.y + p.y * (interiorUV.w - interiorUV.y) / height;
                    uvs.push(uvx, uvy);
                    colors.push(interiorColor.r, interiorColor.g, interiorColor.b, interiorColor.a);
                });

                //Add inner wall positions (repeated for flat shaded mesh)
                positions = positions.concat(wallData.positions);

                interiorIndex = positions.length / 3;

                indices = indices.concat(wallData.indices.map(function (idx: any)
                {
                    return idx + nbIndices;
                }));

                //wallData has format for inner wall [base left, 0 or more doors, base right, top right, top left, windows]
                //extract door and wall data

                windowData = wallData.positions.slice(12 * (doors + 1)); //4 entries per door + 4 entries for wall corners, each entry has 3 data points
                doorData = wallData.positions.slice(3, 3 * (4 * doors + 1));

                //For each inner door save corner as an array of four Vector3s, base left, top left, top right, base right
                //Extend door data outwards by ply and save outer door corners
                var doorCornersIn = [];
                var doorCornersOut = [];
                for (var p = 0; p < doorData.length / 12; p++)
                {
                    var doorsIn = [];
                    var doorsOut = [];
                    for (var d = 0; d < 4; d++)
                    {
                        doorsIn.push(new BABYLON.Vector3(doorData[3 * d + 12 * p], doorData[3 * d + 12 * p + 1], doorData[3 * d + 12 * p + 2]));
                        doorData[3 * d + 12 * p] += ply * wallNormal.x;
                        doorData[3 * d + 12 * p + 2] += ply * wallNormal.z;
                        doorsOut.push(new BABYLON.Vector3(doorData[3 * d + 12 * p], doorData[3 * d + 12 * p + 1], doorData[3 * d + 12 * p + 2]));
                    }
                    doorCornersIn.push(doorsIn);
                    doorCornersOut.push(doorsOut);
                }
                innerDoorCorners.push(doorCornersIn);
                outerDoorCorners.push(doorCornersOut);

                //For each inner window save corner as an array of four Vector3s, base left, top left, top right, base right
                //Extend window data outwards by ply and save outer window corners
                var windowCornersIn = [];
                var windowCornersOut = [];
                for (var p = 0; p < windowData.length / 12; p++)
                {
                    var windowsIn = [];
                    var windowsOut = [];
                    for (var d = 0; d < 4; d++)
                    {
                        windowsIn.push(new BABYLON.Vector3(windowData[3 * d + 12 * p], windowData[3 * d + 12 * p + 1], windowData[3 * d + 12 * p + 2]));
                        windowData[3 * d + 12 * p] += ply * wallNormal.x;
                        windowData[3 * d + 12 * p + 2] += ply * wallNormal.z;
                        windowsOut.push(new BABYLON.Vector3(windowData[3 * d + 12 * p], windowData[3 * d + 12 * p + 1], windowData[3 * d + 12 * p + 2]));
                    }
                    windowCornersIn.push(windowsIn);
                    windowCornersOut.push(windowsOut);
                }
                innerWindowCorners.push(windowCornersIn);
                outerWindowCorners.push(windowCornersOut);

                //Construct OUTER wall facet positions from inner wall
                //Add outer wall corner positions back to wallData positions
                wallData.positions = [];

                wallData.positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z);
                wallData.positions = wallData.positions.concat(doorData);
                wallData.positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[(w + 1) % nbWalls].z);
                wallData.positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[(w + 1) % nbWalls].z);
                wallData.positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z);
                wallData.positions = wallData.positions.concat(windowData);

                //Calulate exterior wall uvs
                // polygonTriangulation._points
                polygonTriangulation["_points"].elements.forEach(function (p: any)
                {
                    if (p.x == 0)
                    {
                        uvx = exteriorUV.x;
                    } else if (wallLength - p.x < 0.000001)
                    {
                        uvx = exteriorUV.x + (wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff)
                    } else
                    {
                        uvx = exteriorUV.x + (0.5 * wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff);
                    }
                    uvy = exteriorUV.y + p.y * (exteriorUV.w - exteriorUV.y) / height;
                    uvs.push(uvx, uvy);
                });

                nbIndices = positions.length / 3; // current number of indices

                //Add outer wall positions, uvs and colors (repeated for flat shaded mesh)
                positions = positions.concat(wallData.positions);


                //Reverse indices for correct normals
                wallData.indices.reverse();

                indices = indices.concat(wallData.indices.map(function (idx: any)
                {
                    return idx + nbIndices;
                }));

                //Construct facets for base and door top and door sides, repeating positions for flatshaded mesh
                var doorsRemaining = doors;
                var doorNb = 0;

                if (doorsRemaining > 0)
                {
                    //base
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z); //tl
                    positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z); //bl
                    positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //tr
                    positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //br

                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left / maxL, exteriorUV.y); //base right

                    indices.push(nbIndices, nbIndices + 2, nbIndices + 3, nbIndices + 3, nbIndices + 1, nbIndices);

                    //left side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
                    positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //tr
                    positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //bl
                    positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl

                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top right
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top Left

                    indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);

                    //top
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //bl
                    positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //br
                    positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
                    positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                    indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);

                    //right side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //tl
                    positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
                    positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
                    positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //br

                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top Left
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right

                    indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);
                }
                doorsRemaining--
                doorNb++

                while (doorsRemaining > 0)
                {

                    //base
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb - 1][3].x, innerDoorCorners[w][doorNb - 1][3].y, innerDoorCorners[w][doorNb - 1][3].z); //bl
                    positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
                    positions.push(outerDoorCorners[w][doorNb - 1][3].x, outerDoorCorners[w][doorNb - 1][3].y, outerDoorCorners[w][doorNb - 1][3].z); //tl
                    positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width)) / maxL / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width)) / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                    indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);

                    //left side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z); //br
                    positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //tr
                    positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z); //bl
                    positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl

                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top right
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top Left

                    indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);

                    //top
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z); //bl
                    positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //br
                    positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z); //tl
                    positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                    indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);

                    //right side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z); //tl
                    positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
                    positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z); //tr
                    positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //br

                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top Left
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH); //top right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right

                    indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);

                    doorsRemaining--
                    doorNb++

                }

                doorNb--;
                nbIndices = positions.length / 3; // current number of indices

                //final base
                if (doors > 0)
                {
                    positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z); //bl
                    positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z); //br
                    positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z); //tl
                    positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width)) / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width)) / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                } else
                {
                    positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z); //bl
                    positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z); //br
                    positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z); //tl
                    positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                }
                indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);

                //Construct facets for window base, top and sides, repeating positions for flatshaded mesh
                for (let ww = 0; ww < innerWindowCorners[w].length; ww++)
                {
                    //left side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z); //tr
                    positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z); //br
                    positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z); //tl
                    positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z); //bl

                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH); //top right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH); //top Left
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left

                    indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 2, nbIndices + 3, nbIndices);

                    //base
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z); //tl
                    positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z); //tr
                    positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z); //bl
                    positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z); //br

                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y); //base right

                    indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 3, nbIndices, nbIndices + 2);

                    //right side
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z); //bl
                    positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z); //tl
                    positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z); //br
                    positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z); //tr

                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH); //top Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x), exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH); //top right

                    indices.push(nbIndices + 1, nbIndices + 2, nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1);

                    //top
                    nbIndices = positions.length / 3; // current number of indices

                    positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z); //br
                    positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z); //bl
                    positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z); //tr
                    positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z); //tl

                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y); //base right
                    uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                    uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right
                    uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left

                    indices.push(nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1, nbIndices, nbIndices + 3);

                }

                //Construction of top of wall facets
                nbIndices = positions.length / 3; // current number of indices

                positions.push(innerTopCorners[w].x, innerTopCorners[w].y, innerTopCorners[w].z); //tl
                positions.push(innerTopCorners[w + 1].x, innerTopCorners[w + 1].y, innerTopCorners[w + 1].z); //tr
                positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z); //bl
                positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[w + 1].z); //br

                uvx = exteriorUV.x + 0.5 * wallDiff * (exteriorUV.z - exteriorUV.x) / maxL;
                uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top Left

                uvx = exteriorUV.x + (0.5 * wallDiff + wallLength) * (exteriorUV.z - exteriorUV.x) / maxL;
                uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH); //top right

                uvs.push(exteriorUV.x, exteriorUV.y); //base Left
                uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * exteriorWallLength / (maxL + wallDiff), exteriorUV.y); //base right

                indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 2, nbIndices + 3, nbIndices);

                for (var p = interiorIndex; p < positions.length / 3; p++)
                {
                    colors.push(exteriorColor.r, exteriorColor.g, exteriorColor.b, exteriorColor.a);
                }

            }

            var normals: any[] = [];

            BABYLON.VertexData.ComputeNormals(positions, indices, normals);


            // https://github.com/BabylonJS/Babylon.js/blob/master/src/Meshes/mesh.vertexData.ts
            // BABYLON.VertexData._ComputeSides
            BABYLON.VertexData["_ComputeSides"](BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);


            //Create a custom mesh
            var customMesh = new BABYLON.Mesh("custom", scene);

            //Create a vertexData object
            var vertexData = new BABYLON.VertexData();

            //Assign positions and indices to vertexData
            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.normals = normals;
            vertexData.uvs = uvs;
            vertexData.colors = colors;

            //Apply vertexData to custom mesh
            vertexData.applyToMesh(customMesh);

            return customMesh;

        }
        //***********************************************************************************

        var baseData = [-3, -2, -1, -4, 1, -4, 3, -2, 5, -2, 5, 1, 2, 1, 2, 3, -3, 3];


        var corners: BABYLON.Vector3[] = [];
        for (let b = 0; b < baseData.length / 2; b++)
        {
            //corners.push(new corner(baseData[2 * b], baseData[2 * b + 1]));
            corners.push(corner(baseData[2 * b], baseData[2 * b + 1]));
        }


        var door = new Door(1, 1.8);
        var doorSpace = new DoorSpace(door, 1);

        var window0 = new MyWindow(1.2, 2.4);
        var window1 = new MyWindow(2, 2.4);

        var windowSpace02 = new WindowSpace(window0, 0.814, 0.4);
        var windowSpace1 = new WindowSpace(window0, 0.4, 0.4);
        var windowSpace78 = new WindowSpace(window1, 1.5, 0.4);

        var walls = [];
        for (let c = 0; c < corners.length; c++)
        {
            walls.push(new Wall(corners[c]));
        }

        walls[0].windowSpaces = [windowSpace02];
        walls[1].windowSpaces = [windowSpace1];
        walls[2].windowSpaces = [windowSpace02];
        walls[7].windowSpaces = [windowSpace78];
        walls[8].windowSpaces = [windowSpace78];

        walls[5].doorSpaces = [doorSpace];


        var ply = 0.3;
        var height = 3.2;

        var house = buildFromPlan(walls, ply, height, {
            interiorUV: new BABYLON.Vector4(0.167, 0, 1, 1),
            exteriorUV: new BABYLON.Vector4(0, 0, 0.16, 1)
        }, scene);

        let mat = new BABYLON.StandardMaterial("", scene);
        //mat.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/88fOIk3.jpg", scene);
        mat.diffuseTexture = new BABYLON.Texture("88fOIk3.jpg", scene);

        house.material = mat;

        return scene;

    }


    export function main()
    {
        var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas"); // Get the canvas element
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        var scene = createScene(engine, canvas); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function ()
        {
            scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function ()
        {
            engine.resize();
        });
    }

}
