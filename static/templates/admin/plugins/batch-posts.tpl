<form role="form" class="batch-posts-settings">
		<div class="row">
			<div class="col-sm-2 col-xs-12 settings-header">Batch Posting</div>
			<div class="col-sm-10 col-xs-12">
				<textarea id="batchData" class="formcontrol">
############################################################
# 
# title: Your title here 1
# tags: Comma, delimited, tags, go, here
#
############################################################

Article 1 goes here


############################################################
# 
# title: Your title here 2
# tags: Comma, delimited, tags, go, here
#
############################################################

Article 2 goes here


############################################################
# 
# title: Your title here 3
# tags: Comma, delimited, tags, go, here
#
############################################################

Article 3 goes here
				</textarea>
				<div class="progress">
					<div class="progress-bar reset" role="progressbar" style="width: 100%"></div>
				</div>
				<div component="category-selector" class="btn-group">
					<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
						<span component="category-selector-selected">[[topic:thread_tools.select_category]]</span> <span class="caret"></span>
					</button>
					<ul class="dropdown-menu category-dropdown-menu" role="menu">
						<!-- BEGIN allCategories -->
						<li role="presentation" class="category" data-cid="{allCategories.cid}" data-name="{allCategories.name}">
							<a role="menu-item">{allCategories.level}<span component="category-markup"><!-- IF allCategories.icon --><span class="fa-stack"><i style="color: {allCategories.bgColor};" class="fa fa-circle fa-stack-2x"></i><i style="color: {allCategories.color};" class="fa fa-stack-1x fa-fw {allCategories.icon}"></i></span><!-- ENDIF allCategories.icon --> {allCategories.name}</span></a>
						</li>
						<!-- END allCategories -->
					</ul>
				</div>
				<button type="button" id="batchPost" class="btn btn-primary">Create Topics</button>
				<button type="button" id="stopPosting" class="btn btn-warning">Stop</button>
				<br /><br />

				<div class="faultyPosts hide">
					<div class="alert alert-danger">Error: unable to post the following topics:</div>
					<textarea id="faultyPosts" class="formcontrol"></textarea>
				</div>
			</div>
		</div>
	</form>