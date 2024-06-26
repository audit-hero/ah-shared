import { ApiLeft, ApiRight, FpTsEither } from "./either.js";
export declare let apiEitherToFpTsEither: <E, A>(e: ApiLeft<E> | ApiRight<A>) => FpTsEither<E, A>;
export declare let fpTsEitherToApiEither: <E, A>(e: FpTsEither<E, A>) => ApiLeft<E> | ApiRight<A>;
export declare let toApiEither: <E, A>(e: FpTsEither<E, A>) => string;
export declare let fromApiEither: <E, A>(s: string) => FpTsEither<E, A>;
