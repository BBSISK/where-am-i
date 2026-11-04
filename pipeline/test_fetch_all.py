from fetch_all import plan, ORDER


def test_cache_only_build_fetches_nothing_when_everything_is_cached():
    assert plan(["Kildare", "Dublin"], {"none"}, exists=lambda p: True) == []


def test_missing_cache_is_fetched_and_named_refresh_is_honoured():
    missing = lambda p: "dib" not in p.name
    assert plan(["Kildare"], {"none"}, exists=missing) == [("dib", "not in cache")]
    assert plan(["Kildare"], {"rps"}, exists=lambda p: True) == [("rps", "refresh requested")]


def test_all_refreshes_everything_in_dependency_order():
    names = [n for n, _ in plan(["Kildare"], {"all"}, exists=lambda p: True)]
    assert names == ORDER and names.index("boundaries") < names.index("npws")
