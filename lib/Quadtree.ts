/**
 * Circle Geometry
 * @beta
 * 
 * @remarks
 * This interface simply represents a circle geometry.
 */
interface CircleGeometry {

    /**
     * X center of the circle.
     */
    x: number

    /**
     * Y center of the circle.
     */
    y: number

    /**
     * Radius of the circle.
     */
    r: number
}

/**
 * Circle Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 */
interface CircleProps<CustomDataType = void> extends CircleGeometry {

    /**
     * Custom data
     */
    data?: CustomDataType
}

/**
 * Class representing a Circle.
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 * 
 * @example Without custom data (JS/TS):
 * ```typescript
 * const circle = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32,
 * });
 * ```
 * 
 * @example With custom data (JS/TS):
 * ```javascript
 * const circle = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32, 
 *   data: { 
 *     name: 'Jane', 
 *     health: 100,
 *   },
 * });
 * ```
 * 
 * @example With custom data (TS):
 * ```typescript
 * interface ObjectData {
 *   name: string
 *   health: number
 * }
 * const entity: ObjectData = {
 *   name: 'Jane',
 *   health: 100,
 * };
 * 
 * // Typescript will infer the type of the data property
 * const circle1 = new Circle({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32, 
 *   data: entity,
 * });
 * 
 * // You can also pass in a generic type for the data property
 * const circle2 = new Circle<ObjectData>({ 
 *   x: 100, 
 *   y: 100, 
 *   r: 32,
 * });
 * circle2.data = entity;
 * ```
 * 
 * @example With custom class extending Circle (implements {@link CircleGeometry} (x, y, r)):
 * ```javascript
 * // extending inherits the qtIndex method
 * class Bomb extends Circle {
 *   
 *   constructor(props) {
 *     // call super to set x, y, r (and data, if given)
 *     super(props);
 *     this.countdown = props.countdown;
 *   }
 * }
 * 
 * const bomb = new Bomb({
 *   countdown: 5,
 *   x: 10, 
 *   y: 20, 
 *   r: 30,
 * });
 * ```
 * 
 * @example With custom class and mapping {@link CircleGeometry}:
 * ```javascript
 * // no need to extend if you don't implement CircleGeometry
 * class Bomb {
 *   
 *   constructor(countdown) {
 *     this.countdown = countdown;
 *     this.position = [10, 20];
 *     this.radius = 30;
 *   }
 *   
 *   // add a qtIndex method to your class
 *   qtIndex(node) {
 *     // map your properties to CircleGeometry
 *     return Circle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       r: this.radius,
 *     }, node);
 *   }
 * }
 * 
 * const bomb = new Bomb(5);
 * ```
 * 
 * @example With custom object that implements {@link CircleGeometry}:
 * ```javascript
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   x: 10, 
 *   y: 20, 
 *   r: 30,
 *   qtIndex: Circle.prototype.qtIndex,
 * });
 * ```
 * 
 * @example With custom object and mapping {@link CircleGeometry}:
 * ```javascript
 * // Note: this is not recommended but possible. 
 * // Using this technique, each object would have it's own qtIndex method. 
 * // Rather add qtIndex to your prototype, e.g. by using classes like shown above.
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   position: [10, 20], 
 *   radius: 30,
 *   qtIndex: function(node) {
 *     return Circle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       r: this.radius,
 *     }, node);
 *   },
 * });
 * ```
 */
class Circle<CustomDataType = void> implements CircleGeometry, Indexable {

    /**
     * X center of the circle.
     */
    x: number;

    /**
     * Y center of the circle.
     */
    y: number;

    /**
     * Radius of the circle.
     */
    r: number;

    /**
     * Custom data.
     */
    data?: CustomDataType;

    /**
     * Circle Constructor
     * @param props - Circle properties
     * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
     */
    constructor(props:CircleProps<CustomDataType>) {

        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant this circle belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node:NodeGeometry): number[] {

        const indexes:number[] = [],
            w2 = node.width/2,
            h2 = node.height/2,
            x2 = node.x + w2,
            y2 = node.y + h2;

        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2,     node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2,     y2],
        ];

        //test all nodes for circle intersections
        for(let i=0; i<nodes.length; i++) {
            if(Circle.intersectRect(this.x, this.y, this.r, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
     
        return indexes;
    }

    /**
     * Check if a circle intersects an axis aligned rectangle.
     * @beta
     * @see https://yal.cc/rectangle-circle-intersection-test/
     * @param x - circle center X
     * @param y - circle center Y
     * @param r - circle radius
     * @param minX - rectangle start X
     * @param minY - rectangle start Y
     * @param maxX - rectangle end X
     * @param maxY - rectangle end Y
     * @returns true if circle intersects rectangle
     *  
     * @example Check if a circle intersects a rectangle:
     * ```javascript
     * const circ = { x: 10, y: 20, r: 30 };
     * const rect = { x: 40, y: 50, width: 60, height: 70 };
     * const intersect = Circle.intersectRect(
     *   circ.x,
     *   circ.y,
     *   circ.r,
     *   rect.x,
     *   rect.y,
     *   rect.x + rect.width,
     *   rect.y + rect.height,
     * );
     * console.log(circle, rect, 'intersect?', intersect);
     * ```
     */
    static intersectRect(x:number, y:number, r:number, minX:number, minY:number, maxX:number, maxY:number): boolean {
        const deltaX = x - Math.max(minX, Math.min(x, maxX));
        const deltaY = y - Math.max(minY, Math.min(y, maxY));
        return (deltaX * deltaX + deltaY * deltaY) < (r * r);
    }
}

/**
 * Line Geometry
 * @beta
 * 
 * @remarks
 * This interface simply represents a line geometry.
 */
interface LineGeometry {

    /**
     * X start of the line.
     */
    x1: number

    /**
     * Y start of the line.
     */
    y1: number

    /**
     * X end of the line.
     */
    x2: number

    /**
     * Y end of the line.
     */
    y2: number
}

/**
 * Line Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 */
interface LineProps<CustomDataType = void> extends LineGeometry {

    /**
     * Custom data
     */
    data?: CustomDataType
}

/**
 * Class representing a Line
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 * 
 * @example Without custom data (JS/TS):
 * ```typescript
 * const line = new Line({
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 * });
 * ```
 * 
 * @example With custom data (JS/TS):
 * ```javascript
 * const line = new Line({
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 *   data: { 
 *     name: 'Jane', 
 *     health: 100,
 *   },
 * });
 * ```
 * 
 * @example With custom data (TS):
 * ```typescript
 * interface ObjectData {
 *   name: string
 *   health: number
 * }
 * const entity: ObjectData = {
 *   name: 'Jane',
 *   health: 100,
 * };
 * 
 * // Typescript will infer the type of the data property
 * const line1 = new Line({ 
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 *   data: entity,
 * });
 * 
 * // You can also pass in a generic type for the data property
 * const line2 = new Line<ObjectData>({
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 * });
 * line2.data = entity;
 * ```
 * 
 * @example With custom class extending Line (implements {@link LineGeometry} (x1, y1, x2, y2)):
 * ```javascript
 * // extending inherits the qtIndex method
 * class Laser extends Line {
 *   
 *   constructor(props) {
 *     // call super to set x1, y1, x2, y2 (and data, if given)
 *     super(props);
 *     this.color = props.color;
 *   }
 * }
 * 
 * const laser = new Laser({
 *   color: 'green',
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 * });
 * ```
 * 
 * @example With custom class and mapping {@link LineGeometry}:
 * ```javascript
 * // no need to extend if you don't implement LineGeometry
 * class Laser {
 *   
 *   constructor(color) {
 *     this.color = color;
 *     this.start = [10, 20];
 *     this.end = [30, 40];
 *   }
 * 
 *   // add a qtIndex method to your class  
 *   qtIndex(node) {
 *     // map your properties to LineGeometry
 *     return Line.prototype.qtIndex.call({
 *       x1: this.start[0],
 *       y1: this.start[1],
 *       x2: this.end[0],
 *       y2: this.end[1],
 *     }, node);
 *   }
 * }
 * 
 * const laser = new Laser('green');
 * ```
 * 
 * @example With custom object that implements {@link LineGeometry}:
 * ```javascript
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   x1: 10, 
 *   y1: 20, 
 *   x2: 30,
 *   y2: 40,
 *   qtIndex: Line.prototype.qtIndex,
 * });
 * ```
 * 
 * @example With custom object and mapping {@link LineGeometry}:
 * ```javascript
 * // Note: this is not recommended but possible. 
 * // Using this technique, each object would have it's own qtIndex method. 
 * // Rather add qtIndex to your prototype, e.g. by using classes like shown above.
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   start: [10, 20], 
 *   end: [30, 40],
 *   qtIndex: function(node) {
 *     return Line.prototype.qtIndex.call({
 *       x1: this.start[0],
 *       y1: this.start[1],
 *       x2: this.end[0],
 *       y2: this.end[1],
 *     }, node);
 *   },
 * });
 * ```
 */
class Line<CustomDataType = void> implements LineGeometry, Indexable {

    /**
     * X start of the line.
     */
    x1: number;

    /**
     * Y start of the line.
     */
    y1: number;

    /**
     * X end of the line.
     */
    x2: number;

    /**
     * Y end of the line.
     */
    y2: number;

    /**
     * Custom data.
     */
    data?: CustomDataType;

    /**
     * Line Constructor
     * @param props - Line properties
     * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
     */
    constructor(props:LineProps<CustomDataType>) {

        this.x1 = props.x1;
        this.y1 = props.y1;
        this.x2 = props.x2;
        this.y2 = props.y2;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant this line belongs to.
     * @beta
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node:NodeGeometry): number[] {

        const indexes:number[] = [],
            w2 = node.width/2,
            h2 = node.height/2,
            x2 = node.x + w2,
            y2 = node.y + h2;

        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2,     node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2,     y2],
        ];

        //test all nodes for line intersections
        for(let i=0; i<nodes.length; i++) {
            if(Line.intersectRect(this.x1, this.y1, this.x2, this.y2, 
                nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)) {
                indexes.push(i);
            }
        }
     
        return indexes;
    }

    /**
     * check if a line segment (the first 4 parameters) intersects an axis aligned rectangle (the last 4 parameters)
     * @beta
     * 
     * @remarks 
     * There is a bug where detection fails on corner intersections
     * when the line enters/exits the node exactly at corners (45°)
     * {@link https://stackoverflow.com/a/18292964/860205}
     * 
     * @param x1 - line start X
     * @param y1 - line start Y
     * @param x2 - line end X
     * @param y2 - line end Y
     * @param minX - rectangle start X
     * @param minY - rectangle start Y
     * @param maxX - rectangle end X
     * @param maxY - rectangle end Y
     * @returns true if the line segment intersects the axis aligned rectangle
     */
    static intersectRect(x1:number, y1:number, x2:number, y2:number, minX:number, minY:number, maxX:number, maxY:number): boolean {
    
        // Completely outside
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;

        // Single point inside
        if ((x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) || (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY))
            return true;
    
        const m = (y2 - y1) / (x2 - x1);
    
        let y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;
    
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;
    
        let x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
    
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
    
        return false;
    }
}
/**
 * Rectangle Geometry
 * @beta
 * 
 * @remarks
 * This interface simply represents a rectangle geometry.
 */
interface RectangleGeometry {

    /**
     * X start of the rectangle (top left).
     */
    x: number

    /**
     * Y start of the rectangle (top left).
     */
    y: number

    /**
     * Width of the rectangle.
     */
    width: number

    /**
     * Height of the rectangle.
     */
    height: number
}

/**
 * Rectangle Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 */
interface RectangleProps<CustomDataType = void> extends RectangleGeometry {

    /**
     * Custom data
     */
    data?: CustomDataType
}

/**
 * Class representing a Rectangle
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 * 
 * @example Without custom data (JS/TS):
 * ```typescript
 * const rectangle = new Rectangle({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * ```
 * 
 * @example With custom data (JS/TS):
 * ```javascript
 * const rectangle = new Rectangle({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 *   data: { 
 *     name: 'Jane', 
 *     health: 100,
 *   },
 * });
 * ```
 * 
 * @example With custom data (TS):
 * ```typescript
 * interface ObjectData {
 *   name: string
 *   health: number
 * }
 * const entity: ObjectData = {
 *   name: 'Jane',
 *   health: 100,
 * };
 * 
 * // Typescript will infer the type of the data property
 * const rectangle1 = new Rectangle({
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 *   data: entity,
 * });
 * 
 * // You can also pass in a generic type for the data property
 * const rectangle2 = new Rectangle<ObjectData>({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * rectangle2.data = entity;
 * ```
 * 
 * @example With custom class extending Rectangle (implements {@link RectangleGeometry} (x, y, width, height)):
 * ```javascript
 * // extending inherits the qtIndex method
 * class Box extends Rectangle {
 *   
 *   constructor(props) {
 *     // call super to set x, y, width, height (and data, if given)
 *     super(props);
 *     this.content = props.content;
 *   }
 * }
 * 
 * const box = new Box({
 *   content: 'Gravity Boots',
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * ```
 * 
 * @example With custom class and mapping {@link RectangleGeometry}:
 * ```javascript
 * // no need to extend if you don't implement RectangleGeometry
 * class Box {
 *   
 *   constructor(content) {
 *     this.content = content;
 *     this.position = [10, 20];
 *     this.size = [30, 40];
 *   }
 *   
 *   // add a qtIndex method to your class
 *   qtIndex(node) {
 *     // map your properties to RectangleGeometry
 *     return Rectangle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       width: this.size[0],
 *       height: this.size[1],
 *     }, node);
 *   }
 * }
 * 
 * const box = new Box('Gravity Boots');
 * ```
 * 
 * @example With custom object that implements {@link RectangleGeometry}:
 * ```javascript
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 30,
 *   qtIndex: Rectangle.prototype.qtIndex,
 * });
 * ```
 * 
 * @example With custom object and mapping {@link RectangleGeometry}:
 * ```javascript
 * // Note: this is not recommended but possible. 
 * // Using this technique, each object would have it's own qtIndex method. 
 * // Rather add qtIndex to your prototype, e.g. by using classes like shown above.
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   position: [10, 20], 
 *   size: [30, 40], 
 *   qtIndex: function(node) {
 *     return Rectangle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       width: this.size[0],
 *       height: this.size[1],
 *     }, node);
 *   },
 * });
 * ```
 */
class Rectangle<CustomDataType = void> implements RectangleGeometry, Indexable {

    /**
     * X start of the rectangle (top left).
     */
    x: number;

    /**
     * Y start of the rectangle (top left).
     */
    y: number;

    /**
     * Width of the rectangle.
     */
    width: number;

    /**
     * Height of the rectangle.
     */
    height: number;

    /**
     * Custom data.
     */
    data?: CustomDataType;

    constructor(props:RectangleProps<CustomDataType>) {
        
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.data = props.data;
    }
    
    /**
     * Determine which quadrant this rectangle belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node:NodeGeometry): number[] {
        
        const indexes:number[] = [],
            boundsCenterX   = node.x + (node.width/2),
            boundsCenterY   = node.y + (node.height/2);

        const startIsNorth  = this.y < boundsCenterY,
            startIsWest     = this.x < boundsCenterX,
            endIsEast       = this.x + this.width > boundsCenterX,
            endIsSouth      = this.y + this.height > boundsCenterY;

        //top-right quad
        if(startIsNorth && endIsEast) {
            indexes.push(0);
        }
        
        //top-left quad
        if(startIsWest && startIsNorth) {
            indexes.push(1);
        }

        //bottom-left quad
        if(startIsWest && endIsSouth) {
            indexes.push(2);
        }

        //bottom-right quad
        if(endIsEast && endIsSouth) {
            indexes.push(3);
        }
     
        return indexes;
    }
}

/**
 * All shape classes must implement this interface.
 */
interface Indexable {
    /**
     * This method is called on all objects that are inserted into or retrieved from the Quadtree.
     * It must determine which quadrant an object belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node: NodeGeometry): number[]
}

/**
 * Interface for geometry of a Quadtree node
 */
interface NodeGeometry {
    /**
     * X position of the node
     */
    x: number

    /**
     * Y position of the node
     */
    y: number

    /**
     * Width of the node
     */
    width: number

    /**
     * Height of the node
     */
    height: number
}

/**
 * Quadtree Constructor Properties
 */
interface QuadtreeProps {

    /**
     * Width of the node.
     */
    width: number

    /**
     * Height of the node.
     */
    height: number

    /**
     * X Offset of the node.
     * @defaultValue `0`
     */
    x?: number

    /**
     * Y Offset of the node.
     * @defaultValue `0`
     */
    y?: number

    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     */
    maxObjects?: number

    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
     */
    maxLevels?: number
}

/**
 * Class representing a Quadtree node.
 * 
 * @example
 * ```typescript
 * const tree = new Quadtree({
 *   width: 100,
 *   height: 100,
 *   x: 0,           // optional, default:  0
 *   y: 0,           // optional, default:  0
 *   maxObjects: 10, // optional, default: 10
 *   maxLevels: 4,   // optional, default:  4
 * });
 * ```
 * 
 * @example Typescript: If you like to be explicit, you optionally can pass in a generic type for objects to be stored in the Quadtree:
 * ```typescript
 * class GameEntity extends Rectangle {
 *   ...
 * }
 * const tree = new Quadtree<GameEntity>({
 *   width: 100,
 *   height: 100,
 * });
 * ```
 */
class Quadtree<ObjectsType extends Rectangle|Circle|Line|Indexable> {

    /**
     * The numeric boundaries of this node.
     * @readonly
     */
    bounds: NodeGeometry;

    /**
     * Max objects this node can hold before it splits.
     * @defaultValue `10`
     * @readonly
     */
    maxObjects: number;
    
    /**
     * Total max nesting levels of the root Quadtree node.
     * @defaultValue `4`
     * @readonly
     */
    maxLevels: number;

    /**
     * The level of this node.
     * @defaultValue `0`
     * @readonly
     */
    level: number;

    /**
     * Array of objects in this node.
     * @defaultValue `[]`
     * @readonly
     */
    objects: ObjectsType[];

    /**
     * Subnodes of this node
     * @defaultValue `[]`
     * @readonly
     */
    nodes: Quadtree<ObjectsType>[];

    /**
     * Quadtree Constructor
     * @param props - bounds and properties of the node
     * @param level - depth level (internal use only, required for subnodes)
     */
    constructor(props:QuadtreeProps, level=0) {
        
        this.bounds = { 
            x: props.x || 0, 
            y: props.y || 0, 
            width: props.width, 
            height: props.height,
        };
        this.maxObjects = (typeof props.maxObjects === 'number') ? props.maxObjects : 10;
        this.maxLevels  = (typeof props.maxLevels === 'number') ? props.maxLevels : 4;
        this.level      = level;
        
        this.objects = [];
        this.nodes   = [];
    }
    
    /**
     * Get the quadrant (subnode indexes) an object belongs to.
     * 
     * @example Mostly for internal use but you can call it like so:
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * const rectangle = new Rectangle({ x: 25, y: 25, width: 10, height: 10 });
     * const indexes = tree.getIndex(rectangle);
     * console.log(indexes); // [1]
     * ```
     * 
     * @param obj - object to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right).
     */
    getIndex(obj:Rectangle|Circle|Line|Indexable): number[] {
        return obj.qtIndex(this.bounds);
    }

    /**
     * Split the node into 4 subnodes.
     * @internal Mostly for internal use! You should only call this yourself if you know what you are doing.
     * 
     * @example Manual split:
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.split();
     * console.log(tree); // now tree has four subnodes
     * ```
     */
    split(): void {
        
        const level = this.level + 1,
            width   = this.bounds.width/2,
            height  = this.bounds.height/2,
            x       = this.bounds.x,
            y       = this.bounds.y;

        const coords = [
            { x: x + width, y: y },
            { x: x,         y: y },
            { x: x,         y: y + height },
            { x: x + width, y: y + height },
        ];

        for(let i=0; i < 4; i++) {
            this.nodes[i] = new Quadtree({
                x: coords[i].x, 
                y: coords[i].y, 
                width,
                height,
                maxObjects: this.maxObjects,
                maxLevels: this.maxLevels,
            }, level);
        }        
    }


    /**
     * Insert an object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding subnodes.
     * 
     * @example you can use any shape here (or object with a qtIndex method, see README):
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.insert(new Rectangle({ x: 25, y: 25, width: 10, height: 10, data: 'data' }));
     * tree.insert(new Circle({ x: 25, y: 25, r: 10, data: 512 }));
     * tree.insert(new Line({ x1: 25, y1: 25, x2: 60, y2: 40, data: { custom: 'property'} }));
     * ```
     * 
     * @param obj - Object to be added.
     */
    insert(obj:ObjectsType): void {

        //if we have subnodes, call insert on matching subnodes
        if(this.nodes.length) {
            const indexes = this.getIndex(obj);
    
            for(let i=0; i<indexes.length; i++) {
                this.nodes[indexes[i]].insert(obj);
            }
            return;
        }
    
        //otherwise, store object here
        this.objects.push(obj);

        //maxObjects reached
        if(this.objects.length > this.maxObjects && this.level < this.maxLevels) {

            //split if we don't already have subnodes
            if(!this.nodes.length) {
                this.split();
            }
            
            //add all objects to their corresponding subnode
            for(let i=0; i<this.objects.length; i++) {
                const indexes = this.getIndex(this.objects[i]);
                for(let k=0; k<indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }

            //clean up this node
            this.objects = [];
        }
    }
    
    
    /**
     * Return all objects that could collide with the given geometry.
     * 
     * @example Just like insert, you can use any shape here (or object with a qtIndex method, see README):
     * ```typescript 
     * tree.retrieve(new Rectangle({ x: 25, y: 25, width: 10, height: 10, data: 'data' }));
     * tree.retrieve(new Circle({ x: 25, y: 25, r: 10, data: 512 }));
     * tree.retrieve(new Line({ x1: 25, y1: 25, x2: 60, y2: 40, data: { custom: 'property'} }));
     * ```
     * 
     * @param obj - geometry to be checked
     * @returns Array containing all detected objects.
     */
    retrieve(obj:Rectangle|Circle|Line|Indexable): ObjectsType[] {
        
        const indexes = this.getIndex(obj);
        let returnObjects = this.objects;
            
        //if we have subnodes, retrieve their objects
        if(this.nodes.length) {
            for(let i=0; i<indexes.length; i++) {
                returnObjects = returnObjects.concat(this.nodes[indexes[i]].retrieve(obj));
            }
        }

        // remove duplicates
        if (this.level === 0) {
            return  Array.from(new Set(returnObjects));
        }

        return returnObjects;
    }


    /**
     * Remove an object from the tree.
     * If you have to remove many objects, consider clearing the entire tree and rebuilding it or use the `fast` flag to cleanup after the last removal.
     * @beta
     * 
     * @example 
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * const circle = new Circle({ x: 25, y: 25, r: 10, data: 512 });
     * tree.insert(circle);
     * tree.remove(circle);
     * ```
     * 
     * @example Bulk fast removals and final cleanup:
     * ```javascript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * const rects = [];
     *  for(let i=0; i<20; i++) {
     *    rects[i] = new Rectangle({ x: 25, y: 25, width: 50, height: 50 });
     *    tree.insert(rects[i]);
     *  }
     *  for(let i=rects.length-1; i>0; i--) {
     *    //fast=true – just remove the object (may leaves vacant subnodes)
     *    //fast=false – cleanup empty subnodes (default)
     *    const fast = (i !== 0);
     *    tree.remove(rects[i], fast); 
     *  }
     * ```
     * 
     * @param obj - Object to be removed.
     * @param fast - Set to true to increase performance temporarily by preventing cleanup of empty subnodes (optional, default: false).
     * @returns Weather or not the object was removed from THIS node (no recursive check).
     */
    remove(obj: ObjectsType, fast=false): boolean {
        
        const indexOf = this.objects.indexOf(obj);
  
        // remove objects
        if(indexOf > -1) {
            this.objects.splice(indexOf, 1);
        }
        
        // remove from all subnodes
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].remove(obj);
        }

        // remove all empty subnodes
        if(this.level === 0 && !fast) {
            this.join();
        }

        return (indexOf !== -1);
    }

    /**
     * Update an object already in the tree (shorthand for remove and insert).
     * If you have to update many objects, consider clearing and rebuilding the 
     * entire tree or use the `fast` flag to cleanup after the last update.
     * @beta
     * 
     * @example 
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100, maxObjects: 1 });
     * const rect1 = new Rectangle({ x: 25, y: 25, width: 10, height: 10 });
     * const rect2 = new Rectangle({ x: 25, y: 25, width: 10, height: 10 });
     * tree.insert(rect1);
     * tree.insert(rect2);
     * rect1.x = 75;
     * rect1.y = 75;
     * tree.update(rect1);
     * ```
     * @example Bulk fast update and final cleanup:
     * ```javascript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * const rects = [];
     *  for(let i=0; i<20; i++) {
     *    rects[i] = new Rectangle({ x: 20, y: 20, width: 20, height: 20 });
     *    tree.insert(rects[i]);
     *  }
     *  for(let i=rects.length-1; i>0; i--) {
     *    rects[i].x = 20 + Math.random()*60;
     *    rects[i].y = 20 + Math.random()*60;
     *    //fast=true – just re-insert the object (may leaves vacant subnodes)
     *    //fast=false – cleanup empty subnodes (default)
     *    const fast = (i !== 0);
     *    tree.update(rects[i], fast); 
     *  }
     * ```
     * 
     * @param obj - Object to be updated.
     * @param fast - Set to true to increase performance temporarily by preventing cleanup of empty subnodes (optional, default: false).
     */
    update(obj: ObjectsType, fast=false): void {
        this.remove(obj, fast);
        this.insert(obj);
    }

    /**
     * The opposite of a split: try to merge and dissolve subnodes.
     * @beta
     * @internal Mostly for internal use! You should only call this yourself if you know what you are doing.
     * 
     * @example Manual join:
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.split();
     * console.log(tree.nodes.length); // 4
     * tree.join();
     * console.log(tree.nodes.length); // 0
     * ```
     * 
     * @returns The objects from this node and all subnodes combined.
     */
    join(): ObjectsType[] {

        // recursive join
        let allObjects = Array.from(this.objects);
        for(let i=0; i < this.nodes.length; i++) {
            const bla = this.nodes[i].join();
            allObjects = allObjects.concat(bla);
        }
        
        // remove duplicates
        const uniqueObjects = Array.from(new Set(allObjects));

        if(uniqueObjects.length <= this.maxObjects) {
            this.objects = uniqueObjects;
            for(let i=0; i < this.nodes.length; i++) {
                this.nodes[i].objects = [];
            }
            this.nodes = [];
        } 

        return allObjects;
    }

    /**
     * Clear the Quadtree.
     * 
     * @example
     * ```typescript
     * const tree = new Quadtree({ width: 100, height: 100 });
     * tree.insert(new Circle({ x: 25, y: 25, r: 10 }));
     * tree.clear();
     * console.log(tree); // tree.objects and tree.nodes are empty
     * ```
     */
    clear(): void {
        
        this.objects = [];
    
        for(let i=0; i < this.nodes.length; i++) {
            if(this.nodes.length) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}
