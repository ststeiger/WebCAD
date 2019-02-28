var Babylon;
(function (Babylon) {
    var Examples;
    (function (Examples) {
        var No2;
        (function (No2) {
            BABYLON.PolygonMeshBuilder.prototype.wallBuilder = function (w0, w1) {
                var positions = [];
                var iuvs = [];
                var euvs = [];
                var icolors = [];
                var ecolors = [];
                var direction = w1.corner.subtract(w0.corner).normalize();
                var angle = Math.acos(direction.x);
                if (direction.z != 0) {
                    angle *= direction.z / Math.abs(direction.z);
                }
                this._points.elements.forEach(function (p) {
                    positions.push(p.x * Math.cos(angle) + w0.corner.x, p.y, p.x * Math.sin(angle) + w0.corner.z);
                });
                var indices = [];
                var res = Earcut.earcut(this._epoints, this._eholes, 2);
                for (var i = res.length; i > 0; i--) {
                    indices.push(res[i - 1]);
                }
                ;
                return { positions: positions, indices: indices };
            };
            var Door = (function () {
                function Door(width, height) {
                    this.width = width;
                    this.height = height;
                    this.left = 0;
                }
                return Door;
            }());
            var DoorSpace = (function () {
                function DoorSpace(door, left) {
                    this.door = door;
                    this.left = left;
                }
                return DoorSpace;
            }());
            var MyWindow = (function () {
                function MyWindow(width, height) {
                    this.width = width;
                    this.height = height;
                    this.left = 0;
                    this.bottom = 0;
                }
                return MyWindow;
            }());
            var WindowSpace = (function () {
                function WindowSpace(window, left, top) {
                    this.window = window;
                    this.left = left;
                    this.top = top;
                }
                return WindowSpace;
            }());
            var Wall = (function () {
                function Wall(corner, doorSpaces, windowSpaces) {
                    this.corner = corner;
                    this.doorSpaces = doorSpaces || [];
                    this.windowSpaces = windowSpaces || [];
                }
                return Wall;
            }());
            var createScene = function (engine, canvas) {
                var scene = new BABYLON.Scene(engine);
                var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
                camera.attachControl(canvas, true);
                var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);
                var corner = function (x, y) {
                    return new BABYLON.Vector3(x, 0, y);
                };
                var buildFromPlan = function (walls, ply, height, options, scene) {
                    var positions = [];
                    var indices = [];
                    var uvs = [];
                    var colors = [];
                    var interiorUV = options.interiorUV || new BABYLON.Vector4(0, 0, 1, 1);
                    var exteriorUV = options.exteriorUV || new BABYLON.Vector4(0, 0, 1, 1);
                    var interiorColor = options.interiorColor || new BABYLON.Color4(1, 1, 1, 1);
                    var exteriorColor = options.exteriorColor || new BABYLON.Color4(1, 1, 1, 1);
                    var interior = options.interior || false;
                    if (!interior) {
                        walls.push(walls[0]);
                    }
                    var interiorIndex;
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
                    if (nbWalls === 2) {
                        walls[1].corner.subtractToRef(walls[0].corner, line);
                        var lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                        line.normalize();
                        innerBaseCorners[0] = walls[0].corner;
                        outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply));
                        innerBaseCorners[1] = walls[1].corner;
                        outerBaseCorners[1] = walls[1].corner.add(lineNormal.scale(ply));
                    }
                    else if (nbWalls > 2) {
                        for (var w = 0; w < nbWalls - 1; w++) {
                            walls[w + 1].corner.subtractToRef(walls[w].corner, nextLine);
                            angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
                            direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
                            var lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                            line.normalize();
                            innerBaseCorners[w] = walls[w].corner;
                            outerBaseCorners[w] = walls[w].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply / Math.tan(angle / 2)));
                            line = nextLine.clone();
                        }
                        if (interior) {
                            var lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                            line.normalize();
                            innerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner;
                            outerBaseCorners[nbWalls - 1] = walls[nbWalls - 1].corner.add(lineNormal.scale(ply));
                            walls[1].corner.subtractToRef(walls[0].corner, line);
                            var lineNormal1 = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                            line.normalize();
                            innerBaseCorners[0] = walls[0].corner;
                            outerBaseCorners[0] = walls[0].corner.add(lineNormal1.scale(ply));
                        }
                        else {
                            walls[1].corner.subtractToRef(walls[0].corner, nextLine);
                            angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
                            direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
                            var lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
                            line.normalize();
                            innerBaseCorners[0] = walls[0].corner;
                            outerBaseCorners[0] = walls[0].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply / Math.tan(angle / 2)));
                            innerBaseCorners[nbWalls - 1] = innerBaseCorners[0];
                            outerBaseCorners[nbWalls - 1] = outerBaseCorners[0];
                        }
                    }
                    for (var w = 0; w < nbWalls; w++) {
                        innerTopCorners.push(new BABYLON.Vector3(innerBaseCorners[w].x, height, innerBaseCorners[w].z));
                        outerTopCorners.push(new BABYLON.Vector3(outerBaseCorners[w].x, height, outerBaseCorners[w].z));
                    }
                    var maxL = 0;
                    for (w = 0; w < nbWalls - 1; w++) {
                        maxL = Math.max(innerBaseCorners[w + 1].subtract(innerBaseCorners[w]).length(), maxL);
                    }
                    var maxH = height;
                    var polygonCorners;
                    var polygonTriangulation;
                    var wallData;
                    var wallDirection = BABYLON.Vector3.Zero();
                    var wallNormal = BABYLON.Vector3.Zero();
                    var wallLength;
                    var exteriorWallLength;
                    var doorData;
                    var windowData;
                    var uvx, uvy;
                    var wallDiff;
                    var compareLeft = function (a, b) {
                        return a.left - b.left;
                    };
                    var _loop_1 = function () {
                        walls[w + 1].corner.subtractToRef(walls[w].corner, wallDirection);
                        wallLength = wallDirection.length();
                        wallDirection.normalize();
                        wallNormal.x = wallDirection.z;
                        wallNormal.z = -1 * wallDirection.x;
                        exteriorWallLength = outerBaseCorners[w + 1].subtract(outerBaseCorners[w]).length();
                        wallDiff = exteriorWallLength - wallLength;
                        gableHeight = 0;
                        if (walls[w].doorSpaces) {
                            walls[w].doorSpaces.sort(compareLeft);
                        }
                        doors = walls[w].doorSpaces.length;
                        polygonCorners = [];
                        polygonCorners.push(new BABYLON.Vector2(0, 0));
                        for (var d = 0; d < doors; d++) {
                            polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, 0));
                            polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left, walls[w].doorSpaces[d].door.height));
                            polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, walls[w].doorSpaces[d].door.height));
                            polygonCorners.push(new BABYLON.Vector2(walls[w].doorSpaces[d].left + walls[w].doorSpaces[d].door.width, 0));
                        }
                        polygonCorners.push(new BABYLON.Vector2(wallLength, 0));
                        polygonCorners.push(new BABYLON.Vector2(wallLength, height));
                        polygonCorners.push(new BABYLON.Vector2(0, height));
                        polygonTriangulation = new BABYLON.PolygonMeshBuilder("", polygonCorners, scene);
                        windows = walls[w].windowSpaces.length;
                        holes = [];
                        for (var ws = 0; ws < windows; ws++) {
                            holeData = [];
                            holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
                            holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top - walls[w].windowSpaces[ws].window.height));
                            holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left + walls[w].windowSpaces[ws].window.width, height - walls[w].windowSpaces[ws].top));
                            holeData.push(new BABYLON.Vector2(walls[w].windowSpaces[ws].left, height - walls[w].windowSpaces[ws].top));
                            holes.push(holeData);
                        }
                        for (var h = 0; h < holes.length; h++) {
                            polygonTriangulation.addHole(holes[h]);
                        }
                        wallData = polygonTriangulation.wallBuilder(walls[w], walls[w + 1]);
                        var nbIndices = positions.length / 3;
                        polygonTriangulation["_points"].elements.forEach(function (p) {
                            uvx = interiorUV.x + p.x * (interiorUV.z - interiorUV.x) / maxL;
                            uvy = interiorUV.y + p.y * (interiorUV.w - interiorUV.y) / height;
                            uvs.push(uvx, uvy);
                            colors.push(interiorColor.r, interiorColor.g, interiorColor.b, interiorColor.a);
                        });
                        positions = positions.concat(wallData.positions);
                        interiorIndex = positions.length / 3;
                        indices = indices.concat(wallData.indices.map(function (idx) {
                            return idx + nbIndices;
                        }));
                        windowData = wallData.positions.slice(12 * (doors + 1));
                        doorData = wallData.positions.slice(3, 3 * (4 * doors + 1));
                        doorCornersIn = [];
                        doorCornersOut = [];
                        for (var p = 0; p < doorData.length / 12; p++) {
                            doorsIn = [];
                            doorsOut = [];
                            for (var d = 0; d < 4; d++) {
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
                        windowCornersIn = [];
                        windowCornersOut = [];
                        for (var p = 0; p < windowData.length / 12; p++) {
                            windowsIn = [];
                            windowsOut = [];
                            for (var d = 0; d < 4; d++) {
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
                        wallData.positions = [];
                        wallData.positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z);
                        wallData.positions = wallData.positions.concat(doorData);
                        wallData.positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[(w + 1) % nbWalls].z);
                        wallData.positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[(w + 1) % nbWalls].z);
                        wallData.positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z);
                        wallData.positions = wallData.positions.concat(windowData);
                        polygonTriangulation["_points"].elements.forEach(function (p) {
                            if (p.x == 0) {
                                uvx = exteriorUV.x;
                            }
                            else if (wallLength - p.x < 0.000001) {
                                uvx = exteriorUV.x + (wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff);
                            }
                            else {
                                uvx = exteriorUV.x + (0.5 * wallDiff + p.x) * (exteriorUV.z - exteriorUV.x) / (maxL + wallDiff);
                            }
                            uvy = exteriorUV.y + p.y * (exteriorUV.w - exteriorUV.y) / height;
                            uvs.push(uvx, uvy);
                        });
                        nbIndices = positions.length / 3;
                        positions = positions.concat(wallData.positions);
                        wallData.indices.reverse();
                        indices = indices.concat(wallData.indices.map(function (idx) {
                            return idx + nbIndices;
                        }));
                        doorsRemaining = doors;
                        doorNb = 0;
                        if (doorsRemaining > 0) {
                            nbIndices = positions.length / 3;
                            positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z);
                            positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z);
                            positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z);
                            positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].left / maxL, exteriorUV.y);
                            indices.push(nbIndices, nbIndices + 2, nbIndices + 3, nbIndices + 3, nbIndices + 1, nbIndices);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z);
                            positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z);
                            positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z);
                            positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z);
                            positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z);
                            positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z);
                            positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z);
                            positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z);
                            positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z);
                            positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);
                        }
                        doorsRemaining--;
                        doorNb++;
                        while (doorsRemaining > 0) {
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb - 1][3].x, innerDoorCorners[w][doorNb - 1][3].y, innerDoorCorners[w][doorNb - 1][3].z);
                            positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z);
                            positions.push(outerDoorCorners[w][doorNb - 1][3].x, outerDoorCorners[w][doorNb - 1][3].y, outerDoorCorners[w][doorNb - 1][3].z);
                            positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width)) / maxL / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (walls[w].doorSpaces[doorNb].left - (walls[w].doorSpaces[doorNb - 1].left + walls[w].doorSpaces[doorNb - 1].door.width)) / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][0].x, innerDoorCorners[w][doorNb][0].y, innerDoorCorners[w][doorNb][0].z);
                            positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z);
                            positions.push(outerDoorCorners[w][doorNb][0].x, outerDoorCorners[w][doorNb][0].y, outerDoorCorners[w][doorNb][0].z);
                            positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices, nbIndices + 3, nbIndices + 2);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][1].x, innerDoorCorners[w][doorNb][1].y, innerDoorCorners[w][doorNb][1].z);
                            positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z);
                            positions.push(outerDoorCorners[w][doorNb][1].x, outerDoorCorners[w][doorNb][1].y, outerDoorCorners[w][doorNb][1].z);
                            positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].doorSpaces[doorNb].door.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            indices.push(nbIndices + 2, nbIndices + 1, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1);
                            nbIndices = positions.length / 3;
                            positions.push(innerDoorCorners[w][doorNb][2].x, innerDoorCorners[w][doorNb][2].y, innerDoorCorners[w][doorNb][2].z);
                            positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z);
                            positions.push(outerDoorCorners[w][doorNb][2].x, outerDoorCorners[w][doorNb][2].y, outerDoorCorners[w][doorNb][2].z);
                            positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].doorSpaces[doorNb].door.height / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            indices.push(nbIndices, nbIndices + 3, nbIndices + 2, nbIndices, nbIndices + 1, nbIndices + 3);
                            doorsRemaining--;
                            doorNb++;
                        }
                        doorNb--;
                        nbIndices = positions.length / 3;
                        if (doors > 0) {
                            positions.push(innerDoorCorners[w][doorNb][3].x, innerDoorCorners[w][doorNb][3].y, innerDoorCorners[w][doorNb][3].z);
                            positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z);
                            positions.push(outerDoorCorners[w][doorNb][3].x, outerDoorCorners[w][doorNb][3].y, outerDoorCorners[w][doorNb][3].z);
                            positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width)) / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * (wallLength - (walls[w].doorSpaces[doorNb].left + walls[w].doorSpaces[doorNb].door.width)) / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                        }
                        else {
                            positions.push(innerBaseCorners[w].x, innerBaseCorners[w].y, innerBaseCorners[w].z);
                            positions.push(innerBaseCorners[w + 1].x, innerBaseCorners[w + 1].y, innerBaseCorners[w + 1].z);
                            positions.push(outerBaseCorners[w].x, outerBaseCorners[w].y, outerBaseCorners[w].z);
                            positions.push(outerBaseCorners[w + 1].x, outerBaseCorners[w + 1].y, outerBaseCorners[w + 1].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * wallLength / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                        }
                        indices.push(nbIndices, nbIndices + 1, nbIndices + 3, nbIndices + 3, nbIndices + 2, nbIndices);
                        for (var ww = 0; ww < innerWindowCorners[w].length; ww++) {
                            nbIndices = positions.length / 3;
                            positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z);
                            positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z);
                            positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z);
                            positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 2, nbIndices + 3, nbIndices);
                            nbIndices = positions.length / 3;
                            positions.push(innerWindowCorners[w][ww][0].x, innerWindowCorners[w][ww][0].y, innerWindowCorners[w][ww][0].z);
                            positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z);
                            positions.push(outerWindowCorners[w][ww][0].x, outerWindowCorners[w][ww][0].y, outerWindowCorners[w][ww][0].z);
                            positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y);
                            indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 3, nbIndices, nbIndices + 2);
                            nbIndices = positions.length / 3;
                            positions.push(innerWindowCorners[w][ww][1].x, innerWindowCorners[w][ww][1].y, innerWindowCorners[w][ww][1].z);
                            positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z);
                            positions.push(outerWindowCorners[w][ww][1].x, outerWindowCorners[w][ww][1].y, outerWindowCorners[w][ww][1].z);
                            positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * ply / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x), exteriorUV.y + (exteriorUV.w - exteriorUV.y) * walls[w].windowSpaces[ww].window.height / maxH);
                            indices.push(nbIndices + 1, nbIndices + 2, nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1);
                            nbIndices = positions.length / 3;
                            positions.push(innerWindowCorners[w][ww][2].x, innerWindowCorners[w][ww][2].y, innerWindowCorners[w][ww][2].z);
                            positions.push(innerWindowCorners[w][ww][3].x, innerWindowCorners[w][ww][3].y, innerWindowCorners[w][ww][3].z);
                            positions.push(outerWindowCorners[w][ww][2].x, outerWindowCorners[w][ww][2].y, outerWindowCorners[w][ww][2].z);
                            positions.push(outerWindowCorners[w][ww][3].x, outerWindowCorners[w][ww][3].y, outerWindowCorners[w][ww][3].z);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y);
                            uvs.push(exteriorUV.x, exteriorUV.y);
                            uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * walls[w].windowSpaces[ww].window.width / maxL, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            uvs.push(exteriorUV.x, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                            indices.push(nbIndices + 3, nbIndices, nbIndices + 2, nbIndices + 1, nbIndices, nbIndices + 3);
                        }
                        nbIndices = positions.length / 3;
                        positions.push(innerTopCorners[w].x, innerTopCorners[w].y, innerTopCorners[w].z);
                        positions.push(innerTopCorners[w + 1].x, innerTopCorners[w + 1].y, innerTopCorners[w + 1].z);
                        positions.push(outerTopCorners[w].x, outerTopCorners[w].y, outerTopCorners[w].z);
                        positions.push(outerTopCorners[w + 1].x, outerTopCorners[w + 1].y, outerTopCorners[w + 1].z);
                        uvx = exteriorUV.x + 0.5 * wallDiff * (exteriorUV.z - exteriorUV.x) / maxL;
                        uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                        uvx = exteriorUV.x + (0.5 * wallDiff + wallLength) * (exteriorUV.z - exteriorUV.x) / maxL;
                        uvs.push(uvx, exteriorUV.y + (exteriorUV.w - exteriorUV.y) * ply / maxH);
                        uvs.push(exteriorUV.x, exteriorUV.y);
                        uvs.push(exteriorUV.x + (exteriorUV.z - exteriorUV.x) * exteriorWallLength / (maxL + wallDiff), exteriorUV.y);
                        indices.push(nbIndices + 1, nbIndices, nbIndices + 3, nbIndices + 2, nbIndices + 3, nbIndices);
                        for (var p = interiorIndex; p < positions.length / 3; p++) {
                            colors.push(exteriorColor.r, exteriorColor.g, exteriorColor.b, exteriorColor.a);
                        }
                    };
                    var gableHeight, doors, windows, holes, holeData, doorCornersIn, doorCornersOut, doorsIn, doorsOut, windowCornersIn, windowCornersOut, windowsIn, windowsOut, doorsRemaining, doorNb;
                    for (var w = 0; w < nbWalls - 1; w++) {
                        _loop_1();
                    }
                    var normals = [];
                    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
                    BABYLON.VertexData["_ComputeSides"](BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);
                    var customMesh = new BABYLON.Mesh("custom", scene);
                    var vertexData = new BABYLON.VertexData();
                    vertexData.positions = positions;
                    vertexData.indices = indices;
                    vertexData.normals = normals;
                    vertexData.uvs = uvs;
                    vertexData.colors = colors;
                    vertexData.applyToMesh(customMesh);
                    return customMesh;
                };
                var baseData = [-3, -2, -1, -4, 1, -4, 3, -2, 5, -2, 5, 1, 2, 1, 2, 3, -3, 3];
                var corners = [];
                for (var b = 0; b < baseData.length / 2; b++) {
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
                for (var c = 0; c < corners.length; c++) {
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
                var mat = new BABYLON.StandardMaterial("", scene);
                mat.diffuseTexture = new BABYLON.Texture("88fOIk3.jpg", scene);
                house.material = mat;
                return scene;
            };
            function main() {
                var canvas = document.getElementById("renderCanvas");
                var engine = new BABYLON.Engine(canvas, true);
                var scene = createScene(engine, canvas);
                engine.runRenderLoop(function () {
                    scene.render();
                });
                window.addEventListener("resize", function () {
                    engine.resize();
                });
            }
            No2.main = main;
        })(No2 = Examples.No2 || (Examples.No2 = {}));
    })(Examples = Babylon.Examples || (Babylon.Examples = {}));
})(Babylon || (Babylon = {}));
